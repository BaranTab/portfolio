import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({
    summary: z.string(),            // tek cümlelik özet: sayfa başında ve paylaşım kartında
    role: z.string().optional(),    // projedeki rolün
    title: z.string(),
    order: z.number(),              // listede kaçıncı sırada görünecek
    type: z.string(),               // "iot paneli", "mobil uygulama"...
    stack: z.array(z.string()),     // ["react", "go"]
    year: z.number(),
    github: z.string().optional(),
    link: z.string().optional(),    // canlı demo varsa
    cover: z.string().optional(),   // önizleme görseli yolu
    featured: z.boolean().default(true),
    
  }),
});

export const collections = { projects };