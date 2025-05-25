import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  username: text("username"),
  ecoPoints: integer("eco_points").default(0),
  streak: integer("streak").default(0),
  completedTasks: integer("completed_tasks").default(0),
  achievements: json("achievements").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  authorWallet: text("author_wallet").notNull(),
  yesVotes: integer("yes_votes").default(0),
  noVotes: integer("no_votes").default(0),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull(),
  voterWallet: text("voter_wallet").notNull(),
  vote: boolean("vote").notNull(), // true for yes, false for no
  transactionHash: text("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ecoTasks = pgTable("eco_tasks", {
  id: serial("id").primaryKey(),
  userWallet: text("user_wallet").notNull(),
  taskType: text("task_type").notNull(),
  taskId: text("task_id").notNull(),
  pointsAwarded: integer("points_awarded").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  yesVotes: true,
  noVotes: true,
  isActive: true,
  createdAt: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

export const insertEcoTaskSchema = createInsertSchema(ecoTasks).omit({
  id: true,
  completedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type EcoTask = typeof ecoTasks.$inferSelect;
export type InsertEcoTask = z.infer<typeof insertEcoTaskSchema>;
