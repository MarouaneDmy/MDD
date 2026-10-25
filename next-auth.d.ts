import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  // 1. Étendre l'interface User retournée par authorize()
  interface User extends DefaultUser {
    username?: string;
  }

  // 2. Étendre l'interface Session pour inclure id et username
  interface Session {
    user: {
      id: string;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // 3. Étendre le JWT pour inclure username
  interface JWT {
    username?: string;
  }
}
