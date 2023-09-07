import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { users } from "drizzle/schema";

export const userRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(users).all(); 
  }),

  saveData: privateProcedure
  .input(
    z.object({
      time: z.number(),
    })
  )
  .query(async ({ ctx, input }) => {
    
  }) 

});

