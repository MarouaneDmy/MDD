import { z } from "zod";
import { optionalPasswordSchema } from "./password.schema";

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const registerSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  password: optionalPasswordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
