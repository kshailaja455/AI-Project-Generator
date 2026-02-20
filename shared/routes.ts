import { z } from 'zod';
import { insertProjectIdeaSchema, projectIdeas } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  ideas: {
    generate: {
      method: 'POST' as const,
      path: '/api/ideas/generate' as const,
      input: insertProjectIdeaSchema,
      responses: {
        201: z.custom<typeof projectIdeas.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/ideas' as const,
      responses: {
        200: z.array(z.custom<typeof projectIdeas.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/ideas/:id' as const,
      responses: {
        200: z.custom<typeof projectIdeas.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
