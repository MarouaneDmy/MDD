import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(1000, "Le commentaire est trop long"),
  articleId: z.string().cuid(),
});
