"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth.schema";

const prisma = new PrismaClient();

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const validatedData = registerSchema.safeParse({ email, username, password });

  if (!validatedData.success) {
    return {
      success: false,
      error: validatedData.error.issues[0].message,
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: validatedData.data.email,
        username: validatedData.data.username,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      userId: user.id,
    };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "Cet email est déjà utilisé.",
      };
    }

    return {
      success: false,
      error: "Une erreur est survenue lors de l'inscription.",
    };
  }
}
