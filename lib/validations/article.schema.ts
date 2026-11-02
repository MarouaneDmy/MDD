import { z } from "zod";

export const articleSchema = z.object({
  title: z
    .string()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(200, "Le titre est trop long"),
  content: z
    .string()
    .min(50, "Le contenu doit contenir au moins 50 caractères")
    .max(5000, "Le contenu est trop long"),
  topicIds: z
    .array(z.string())
    .min(1, "Vous devez sélectionner au moins un thème"),
});
