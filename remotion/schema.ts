import { z } from "zod";

export const signalMatchExplainerSchema = z.object({
  slug: z.string().min(1),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  hook: z.string().min(1),
  beats: z.tuple([z.string(), z.string(), z.string()]),
  cta: z.string().min(1),
  resourceUrl: z.string().url(),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export type SignalMatchExplainerProps = z.infer<
  typeof signalMatchExplainerSchema
>;
