import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations/auth.schema";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validation des données entrantes
        const parsedCredentials = loginSchema.safeParse(credentials);
        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // 2. Vérification en base de données (Prisma)
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null; // Utilisateur non trouvé

        // 3. Vérification du mot de passe (bcrypt)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null; // Mot de passe incorrect

        // 4. Retourner l'utilisateur (sans le mot de passe !)
        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // Rediriger vers notre page de login personnalisée
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});
