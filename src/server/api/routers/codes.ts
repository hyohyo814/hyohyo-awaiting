// import { z } from "zod";
import { codes } from "drizzle/schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const codeRouter = createTRPCRouter({
  getCodes: publicProcedure.query(async ({ ctx }) => {
    const codeArr = await ctx.db.select({content: codes.content}).from(codes).orderBy().limit(1);
    if (!codeArr[0]?.content) {
      return;
    }

    return codeArr[0].content.split("\\n");
  })
  
});

