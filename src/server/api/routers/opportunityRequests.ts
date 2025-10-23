import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { opportunities, opportunityRequests } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const opportunityRequestsRouter = createTRPCRouter({
  // Submit a request for an opportunity (stores react-jsonschema-form data)
  create: protectedProcedure
    .input(
      z.object({
        opportunityId: z.number().int().positive(),
        formData: z.any(),
        meta: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // ensure opportunity exists
      const opp = await ctx.db.query.opportunities.findFirst({
        where: eq(opportunities.id, input.opportunityId),
      });
      if (!opp) {
        throw new Error("Opportunity not found");
      }

      const insertResult = await ctx.db.insert(opportunityRequests).values({
        userId,
        opportunityId: input.opportunityId,
        formData: input.formData as unknown as object,
        meta: (input.meta ?? null) as unknown as object,
      });

      return insertResult;
    }),

  // List my own requests (most recent first)
  listMine: protectedProcedure
    .input(
      z
        .object({ opportunityId: z.number().int().positive().optional() })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.db.query.opportunityRequests.findMany({
        where: and(
          eq(opportunityRequests.userId, userId),
          input?.opportunityId
            ? eq(opportunityRequests.opportunityId, input.opportunityId)
            : undefined,
        ),
        orderBy: (t, { desc }) => [desc(t.createdAt)],
        with: {
          opportunity: true,
          user: true,
        },
      });
    }),

  // List my own requests (most recent first)
  listAll: adminProcedure
    .input(
      z
        .object({ opportunityId: z.number().int().positive().optional() })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.opportunityRequests.findMany({
        where: input?.opportunityId
          ? eq(opportunityRequests.opportunityId, input.opportunityId)
          : undefined,
        // orderBy: (t, { desc }) => [desc(t.createdAt)],
        with: {
          opportunity: true,
          user: true,
        },
      });
    }),

  // Admin: list requests for a specific opportunity
  listByOpportunity: adminProcedure
    .input(z.object({ opportunityId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.opportunityRequests.findMany({
        where: eq(opportunityRequests.opportunityId, input.opportunityId),
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      });
    }),

  // Admin: update request status
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["PENDING", "REVIEWING", "APPROVED", "REJECTED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(opportunityRequests)
        .set({ status: input.status })
        .where(eq(opportunityRequests.id, input.id));
      return { ok: true };
    }),
});
