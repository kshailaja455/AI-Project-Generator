import { db } from "./db";
import { projectIdeas, type InsertProjectIdea, type ProjectIdea } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  getIdea(id: number): Promise<ProjectIdea | undefined>;
  getIdeas(): Promise<ProjectIdea[]>;
  saveIdea(idea: InsertProjectIdea, result: any): Promise<ProjectIdea>;
}

export class DatabaseStorage implements IStorage {
  async getIdea(id: number): Promise<ProjectIdea | undefined> {
    const [idea] = await db.select().from(projectIdeas).where(eq(projectIdeas.id, id));
    return idea;
  }

  async getIdeas(): Promise<ProjectIdea[]> {
    return await db.select().from(projectIdeas).orderBy(desc(projectIdeas.createdAt));
  }

  async saveIdea(idea: InsertProjectIdea, result: any): Promise<ProjectIdea> {
    const [savedIdea] = await db.insert(projectIdeas).values({
      ...idea,
      result
    }).returning();
    return savedIdea;
  }
}

export const storage = new DatabaseStorage();
