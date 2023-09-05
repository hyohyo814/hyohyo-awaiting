// import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { codes } from "drizzle/schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const codeRouter = createTRPCRouter({
  getCodes: publicProcedure.query(async ({ ctx }) => {
    const codeArr = await ctx.db.select({content: codes.content}).from(codes);
    const rand = Math.floor(Math.random() * codeArr.length) ?? 0;

    if (!codeArr[rand]?.content) {
      return;
    }

    if (!codeArr[rand]?.content) {
      throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})
    }

    return codeArr[rand]?.content?.split("\\n");
  })
  
});

