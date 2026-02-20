import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// the openai integration sets OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.post(api.ideas.generate.path, async (req, res) => {
    try {
      const input = api.ideas.generate.input.parse(req.body);
      
      const prompt = `You are an expert full-stack developer and academic advisor.
Generate a student-level mini project idea based on the following preferences:
- Domain: ${input.domain}
- Skill Level: ${input.skillLevel}
- Team Size: ${input.teamSize}
- Time Limit: ${input.timeLimit}
- Faculty Strictness Level: ${input.strictnessLevel}
- Project Type: ${input.projectType}
- Complexity Preference: ${input.complexity}

Requirements:
- Suggest only student-level projects, avoid research-level topics
- Avoid copied common ideas, make it unique and innovative
- Make idea practical and doable within the time limit
- Keep explanation simple and ensure faculty-friendly explanation
- Must be appropriate for a ${input.teamSize} person team

Output strictly as a JSON object with this exact structure:
{
  "project_title": "String",
  "difficulty": "Easy, Medium, or Hard",
  "faculty_acceptance_chance": "High Chance of Approval, Moderate Chance, or Needs Improvement",
  "problem_statement": "String",
  "solution_overview": "String",
  "key_features": ["String"],
  "tools_required": ["String"],
  "architecture_flow": "String",
  "future_enhancements": ["String"],
  "viva_questions": ["String", "String"],
  "interview_questions": ["String", "String"]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const resultContent = response.choices[0].message.content;
      if (!resultContent) {
        throw new Error("No content received from OpenAI");
      }

      const parsedResult = JSON.parse(resultContent);
      const idea = await storage.saveIdea(input, parsedResult);
      res.status(201).json(idea);

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Error generating idea:", err);
      res.status(500).json({ message: "Failed to generate idea" });
    }
  });

  app.get(api.ideas.list.path, async (req, res) => {
    const ideas = await storage.getIdeas();
    res.json(ideas);
  });

  app.get(api.ideas.get.path, async (req, res) => {
    const idea = await storage.getIdea(Number(req.params.id));
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    res.json(idea);
  });

  return httpServer;
}
