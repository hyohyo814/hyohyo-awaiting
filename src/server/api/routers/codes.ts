// import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { codes, records } from "drizzle/schema";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";

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
  }),

  getRecords: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.codes.findMany({
      columns: {
        content: false,
        createdAt: false,
        updatedAt: false,
      },
      with: {
        records: {
          where: eq(records.userId, ctx.userId),
          columns: {
            time: true,
            id: true,
          }
        }
      }
    }) 
  })
});

