import { z } from "zod";
import { optionalPasswordSchema } from "./password.schema";

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(50, "Le nom d'utilisateur est trop long"),
  email: z.string().email("Adresse email invalide"),
  password: optionalPasswordSchema,
});
