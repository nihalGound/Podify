import { mutation } from "./_generated/server";
 
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
 
    // Return an upload URL
    return await ctx.storage.generateUploadUrl();
  },
});