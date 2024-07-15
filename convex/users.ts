import { ConvexError, convexToJson, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const createUser = internalMutation({
    args:{
        email:v.string(),
        name:v.string(),
        clerkId:v.string(),
        imageUrl:v.string()
    },
    handler : async (ctx, args)=>{
        //check if user already exist
        const user = await ctx.db
                            .query("users")
                            .filter((q)=>q.eq(q.field("email"),args.email) && q.eq(q.field("clerkId"),args.clerkId))
                            .unique();
        if(user)
            return ;
        await ctx.db.insert("users",{
            email:args.email,
            name:args.name,
            imageUrl:args.imageUrl,
            clerkId:args.clerkId
        });
    }
});

export const getUserById = query({
    args:{clerkId:v.string()},
    handler : async (ctx,args)=>{
        const user = await ctx.db
        .query("users")
        .filter((q)=>q.eq(q.field("clerkId"),args.clerkId))
        .unique();
        if(!user)
            throw new ConvexError("User not found");
        return user;
    }
});

export const getTopUserByPodcastCount = query({
    args:{},
    handler : async (ctx,args)=>{
        const users = await ctx.db.query("users").collect();

        const userData = await Promise.all(
            users.map(async (u)=>{
                const podcasts = await ctx.db
                                    .query("podcasts")
                                    .filter((q)=>q.eq(q.field("authorId"),u.clerkId))
                                    .collect();

                const sortedPodcast = podcasts.sort((a,b)=>b.views-a.views);

                return {
                    ...u,
                    totalPodcasts:podcasts.length,
                    podcasts:sortedPodcast.map((p)=>({
                        podcastTitle : p.podcastTitle,
                        podcastId : p._id
                    })),
                };
            })
        );
        return userData.sort((a,b)=>b.totalPodcasts-a.totalPodcasts);
    }
});

export const updateUser = internalMutation({
    args:{
        clerkId:v.string(),
        email:v.string(),
        imageUrl:v.string()
    },
    handler : async (ctx,args)=>{
        //first find user
        const user = await ctx.db
                            .query("users")
                            .filter((q)=>q.eq(q.field("clerkId"),args.clerkId))
                            .unique();
        if(!user)
            throw new ConvexError("User not found");
        
        //find all podcast which is owned by user
        const podcasts = await ctx.db
                                .query("podcasts")
                                .filter((q)=>q.eq(q.field("authorId"),args.clerkId))
                                .collect();

        //update user data
        await ctx.db.patch(user._id,{
            imageUrl:args.imageUrl,
            email:args.email
        });

        //update all podcase authorImageUrl
        await Promise.all(
            podcasts.map(async (p)=>{
                await ctx.db.patch(p._id,{
                    authorImageUrl:args.imageUrl,
                });
            })
        );

        
    }
});

export const deleteUser = internalMutation({
    args:{
        clerkId:v.string(),
    },
    handler : async (ctx,args)=>{
        const user = await ctx.db
                            .query("users")
                            .filter((q)=>q.eq(q.field("clerkId"),args.clerkId))
                            .unique();
        if(!user)
            throw new ConvexError("User not found");

        await ctx.db.delete(user._id);
    }
});


