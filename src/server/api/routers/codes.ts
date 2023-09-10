// import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { codes } from "drizzle/schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const codeRouter = createTRPCRouter({
  getCodes: publicProcedure.query(async ({ ctx }) => {
    const codeArr = await ctx.db.select({content: codes.content, id: codes.id}).from(codes);
    const rand = Math.floor(Math.random() * codeArr.length) ?? 0;
    const randSel = codeArr[rand]

    if (!randSel?.content || !randSel?.id) {
      throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})
    }

    return {
      data: randSel?.content?.split("\\n"),
      id: randSel.id,
    };
  })
  
});

