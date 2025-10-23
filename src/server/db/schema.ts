import { relations, sql } from "drizzle-orm";
import { index, mysqlTableCreator, primaryKey } from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    name: d.varchar({ length: 256 }),
    description: d.text(),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().onUpdateNow(),
  }),
  (t) => [
    index("created_by_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ],
);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      fsp: 3,
    })
    .default(sql`CURRENT_TIMESTAMP(3)`),
  image: d.varchar({ length: 255 }),
  // Store user roles as a JSON array; allow null to avoid DEFAULT expression issues in MySQL
  roles: d.json("roles").$type<("ADMIN" | "USER")[]>(),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.int(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({
      columns: [t.provider, t.providerAccountId],
    }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date" }).notNull(),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date" }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const opportunityTypes = [
  "CONSTRUCTION",
  "SERVICE_PROVIDER",
  "INVESTMENT",
  "SUPPLY",
] as const;

// Use mysqlTable instead of pgTable
export const opportunities = createTable("opportunity", (d) => ({
  // Define the primary key for MySQL
  id: d.int("id").autoincrement().primaryKey(),
  title: d.varchar("title", { length: 256 }).notNull(),
  description: d.text("description"),
  longDescription: d.text("long_description"), // ✨ Add this new field

  type: d.varchar("type", { length: 50 }).notNull(),
  accessLevel: d.varchar("access_level", { length: 50 }).default("PUBLIC"),
  jsonSchema: d.json("json_schema"),
  uiSchema: d.json("ui_schema"),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d.timestamp("updated_at").onUpdateNow(), // Use onUpdateNow for automatic updates in MySQL
}));

// Allow users to watch/follow opportunities for updates
export const opportunityWatches = createTable(
  "opportunity_watch",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    opportunityId: d
      .int()
      .notNull()
      .references(() => opportunities.id),
    createdAt: d.timestamp().defaultNow().notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.userId, t.opportunityId] }),
    index("watch_user_idx").on(t.userId),
    index("watch_opportunity_idx").on(t.opportunityId),
  ],
);

export const opportunityWatchesRelations = relations(
  opportunityWatches,
  ({ one }) => ({
    user: one(users, {
      fields: [opportunityWatches.userId],
      references: [users.id],
    }),
    opportunity: one(opportunities, {
      fields: [opportunityWatches.opportunityId],
      references: [opportunities.id],
    }),
  }),
);

// Store user requests/submissions for opportunities
export const opportunityRequests = createTable(
  "opportunity_request",
  (d) => ({
    id: d.int("id").autoincrement().primaryKey(),
    opportunityId: d
      .int("opportunity_id")
      .notNull()
      .references(() => opportunities.id),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    // Raw data captured from react-jsonschema-form submissions
    formData: d.json("form_data"),
    // Optional metadata for processing (e.g., review notes, attachments manifest)
    meta: d.json("meta"),
    status: d.varchar("status", { length: 32 }).notNull().default("PENDING"),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    updatedAt: d.timestamp("updated_at").onUpdateNow(),
  }),
  (t) => [
    index("request_user_idx").on(t.userId),
    index("request_opportunity_idx").on(t.opportunityId),
    index("request_status_idx").on(t.status),
  ],
);

export const opportunityRequestsRelations = relations(
  opportunityRequests,
  ({ one }) => ({
    user: one(users, {
      fields: [opportunityRequests.userId],
      references: [users.id],
    }),
    opportunity: one(opportunities, {
      fields: [opportunityRequests.opportunityId],
      references: [opportunities.id],
    }),
  }),
);
