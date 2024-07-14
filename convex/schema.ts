import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    podcasts: defineTable({
        user : v.id("users"),
        audioStorageId : v.union(v.id('_storage'),v.null()),
        audioUrl : v.optional(v.string()),
        imageStorageId : v.union(v.id("_storage"),v.null()),
        imageUrl : v.optional(v.string()),
        podcastTitle : v.string(),
        podcastDescription : v.string(),
        author : v.string(),
        authorId : v.string(),
        authorImageUrl : v.string(),
        voicePrompt : v.string(),
        imagePrompt : v.string(),
        voiceType : v.string(),
        audioDuration : v.number(),
        views : v.number(),
    })
    .searchIndex('search_author',{searchField:'author'})
    .searchIndex('search_title',{searchField:'podcastTitle'})
    .searchIndex('search_description',{searchField:'podcastDescription'}),
    
    users : defineTable({
        email : v.string(),
        name : v.string(),
        clerkId : v.string(),
        imageUrl : v.string()
    })
})