import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertProjectIdea, ProjectIdea } from "@shared/schema";
import { z } from "zod";

// Define the structure of the JSON result based on implementation notes
export interface IdeaResult {
  project_title: string;
  problem_statement: string;
  solution_overview: string;
  architecture_flow: string;
  key_features: string[];
  tools_required: string[];
  faculty_acceptance_chance: string;
  difficulty: string;
  viva_questions: string[];
  interview_questions: string[];
  future_enhancements: string[];
}

export function useGenerateIdea() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertProjectIdea) => {
      // Validate input before sending using the schema from routes
      const validated = api.ideas.generate.input.parse(data);
      
      const res = await fetch(api.ideas.generate.path, {
        method: api.ideas.generate.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        if (res.status === 500) {
           const error = await res.json();
           throw new Error(error.message || "Internal server error");
        }
        throw new Error("Failed to generate idea");
      }

      // Parse response with Zod
      return api.ideas.generate.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your project idea has been generated successfully.",
      });
      // Invalidate list query so history updates if we add a history page later
      queryClient.invalidateQueries({ queryKey: [api.ideas.list.path] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useIdeas() {
  return useQuery({
    queryKey: [api.ideas.list.path],
    queryFn: async () => {
      const res = await fetch(api.ideas.list.path);
      if (!res.ok) throw new Error("Failed to fetch ideas");
      return api.ideas.list.responses[200].parse(await res.json());
    },
  });
}

export function useIdea(id: number) {
  return useQuery({
    queryKey: [api.ideas.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.ideas.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch idea");
      return api.ideas.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
