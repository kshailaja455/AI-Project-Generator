import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projectIdeas = pgTable("project_ideas", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  skillLevel: text("skill_level").notNull(),
  teamSize: integer("team_size").notNull(),
  timeLimit: text("time_limit").notNull(),
  strictnessLevel: text("strictness_level").notNull(),
  projectType: text("project_type").notNull(),
  complexity: text("complexity").notNull(),
  result: jsonb("result").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectIdeaSchema = createInsertSchema(projectIdeas).pick({
  domain: true,
  skillLevel: true,
  teamSize: true,
  timeLimit: true,
  strictnessLevel: true,
  projectType: true,
  complexity: true,
});

export type InsertProjectIdea = z.infer<typeof insertProjectIdeaSchema>;
export type ProjectIdea = typeof projectIdeas.$inferSelect;
