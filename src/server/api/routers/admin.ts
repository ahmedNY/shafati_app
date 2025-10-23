import { z } from "zod";
import { count, eq } from "drizzle-orm";

import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import {
  opportunities,
  opportunityWatches,
  users,
  opportunityTypes,
} from "@/server/db/schema";

export const adminRouter = createTRPCRouter({
  // Basic stats for dashboard home
  stats: adminProcedure.query(async ({ ctx }) => {
    const usersCount = await ctx.db.select({ count: count() }).from(users);
    const oppsCount = await ctx.db.select({ count: count() }).from(opportunities);
    const watchesCount = await ctx.db.select({ count: count() }).from(opportunityWatches);

    return {
      users: Number(usersCount.at(0)?.count ?? 0),
      opportunities: Number(oppsCount.at(0)?.count ?? 0),
      watches: Number(watchesCount?.at(0)?.count ?? 0),
    };
  }),

  // List and filter opportunities
  listOpportunities: adminProcedure
    .input(
      z.object({
        type: z.enum(opportunityTypes).optional(),
        q: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.query.opportunities.findMany({
        where: input?.type
          ? eq(opportunities.type, input.type)
          : undefined,
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      });
      // simple contains filter client-side for now if q provided
      return input?.q
        ? rows.filter(
            (r) =>
              r.title.toLowerCase().includes(input.q!.toLowerCase()) ||
              (r.description ?? "")
                .toLowerCase()
                .includes(input.q!.toLowerCase()),
          )
        : rows;
    }),

  createOpportunity: adminProcedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().optional(),
        longDescription: z.string().optional(),
        type: z.enum(opportunityTypes),
        accessLevel: z.string().default("PUBLIC"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
       await ctx.db.insert(opportunities).values({
        title: input.title,
        description: input.description,
        longDescription: input.longDescription,
        type: input.type,
        accessLevel: input.accessLevel,
      });
      // MySQL driver returns insert id through driver; re-fetch last inserted
      const created = await ctx.db.query.opportunities.findFirst({
        where: eq(opportunities.title, input.title),
        orderBy: (t, { desc }) => [desc(t.id)],
      });
      return created ?? null;
    }),

  updateOpportunity: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(3).optional(),
        description: z.string().optional(),
        longDescription: z.string().optional(),
        type: z.enum(opportunityTypes).optional(),
        accessLevel: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(opportunities)
        .set({
          ...(input.title ? { title: input.title } : {}),
          ...(input.description ? { description: input.description } : {}),
          ...(input.longDescription
            ? { longDescription: input.longDescription }
            : {}),
          ...(input.type ? { type: input.type } : {}),
          ...(input.accessLevel ? { accessLevel: input.accessLevel } : {}),
        })
        .where(eq(opportunities.id, input.id));

      const updated = await ctx.db.query.opportunities.findFirst({
        where: eq(opportunities.id, input.id),
      });
      return updated ?? null;
    }),
});
