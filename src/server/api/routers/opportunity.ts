import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import {
  opportunities,
  opportunityWatches,
  opportunityTypes,
} from "@/server/db/schema"; // 👈 Import the constant array
import { and, eq } from "drizzle-orm";

export const opportunityRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        // Use z.enum() with the imported array of string literals for validation.
        type: z.enum(opportunityTypes).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // NO CHANGES HERE: The Drizzle query works identically with strings.
      const allOpportunities = await ctx.db.query.opportunities.findMany({
        where: input.type ? eq(opportunities.type, input.type) : undefined,
        orderBy: (opportunities, { desc }) => [desc(opportunities.createdAt)],
      });

      return allOpportunities;
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const opportunity = await ctx.db.query.opportunities.findFirst({
        where: eq(opportunities.id, input.id),
      });

      return opportunity;
    }),
  // Set follow/unfollow for the current user
  setWatch: protectedProcedure
    .input(z.object({ opportunityId: z.number(), watch: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (input.watch) {
        // follow: insert if not exists
        await ctx.db
          .insert(opportunityWatches)
          .values({ userId, opportunityId: input.opportunityId })
          .onDuplicateKeyUpdate({ set: { userId } });
        return { watched: true };
      }

      // unfollow: delete
      await ctx.db
        .delete(opportunityWatches)
        .where(
          and(
            eq(opportunityWatches.userId, userId),
            eq(opportunityWatches.opportunityId, input.opportunityId),
          ),
        );
      return { watched: false };
    }),
  // List opportunities watched by the current user
  getWatchedByMe: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const rows = await ctx.db
      .select({
        id: opportunities.id,
        title: opportunities.title,
        description: opportunities.description,
        longDescription: opportunities.longDescription,
        type: opportunities.type,
        accessLevel: opportunities.accessLevel,
        createdAt: opportunities.createdAt,
        updatedAt: opportunities.updatedAt,
      })
      .from(opportunities)
      .innerJoin(
        opportunityWatches,
        and(
          eq(opportunityWatches.opportunityId, opportunities.id),
          eq(opportunityWatches.userId, userId),
        ),
      );
    // .orderBy((opportunities, { desc }) => desc(opportunities.createdAt));

    return rows;
  }),
});
