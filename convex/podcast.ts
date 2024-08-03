import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const createPodcast = mutation({
    args:{
        audioStorageId : v.id("_storage"),
        audioUrl :v.string(),
        imageStorageId : v.id("_storage"),
        imageUrl : v.string(),
        podcastTitle : v.string(),
        podcastDescription : v.string(),
        voicePrompt : v.string(),
        imagePrompt : v.string(),
        voiceType : v.string(),
        audioDuration : v.number(),
        views : v.number(),
    },
    handler: async (ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("unauthenticated user");
        }

        //find user exist in out db or not
        const user = await ctx.db.query("users").filter((q)=>q.eq(q.field("email"),identity.email)).unique();

        if(!user){
            throw new ConvexError("user not found");
        }

        //now upload podcast in db
        return await ctx.db.insert("podcasts",{
            audioStorageId : args.audioStorageId,
            user:user._id,
            audioDuration:args.audioDuration,
            views:args.views,
            voicePrompt:args.voicePrompt,
            voiceType:args.voiceType,
            audioUrl:args.audioUrl,
            imagePrompt:args.imagePrompt,
            imageStorageId:args.imageStorageId,
            imageUrl:args.imageUrl,
            podcastTitle:args.podcastTitle,
            podcastDescription:args.podcastDescription,
            author:user.name,
            authorId:user.clerkId,
            authorImageUrl:user.imageUrl
        });
    }
});

export const getUrl = mutation({
    args:{
        storageId : v.id("_storage")
    },
    handler: async (ctx,args)=>{
        return await ctx.storage.getUrl(args.storageId);
    }
})