// app/actions/profile.actions.ts
"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

// Schéma de validation pour la mise à jour du profil
const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(50, "Le nom d'utilisateur est trop long"),
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .optional()
    .or(z.literal("")),
});

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Vous devez être connecté" };
  }

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validation avec Zod
  const validatedData = profileSchema.safeParse({ username, email, password });

  if (!validatedData.success) {
    return {
      success: false,
      error: validatedData.error.issues[0].message,
    };
  }

  try {
    const updateData: {
      username?: string;
      email?: string;
      password?: string;
    } = {
      username: validatedData.data.username,
      email: validatedData.data.email,
    };

    // Hacher le mot de passe seulement s'il est fourni
    if (validatedData.data.password && validatedData.data.password.length > 0) {
      updateData.password = await bcrypt.hash(validatedData.data.password, 10);
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    // Gérer l'erreur de contrainte unique (email déjà utilisé)
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "Cet email est déjà utilisé par un autre compte",
      };
    }

    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour",
    };
  }
}

export async function unsubscribeFromTopic(topicId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Vous devez être connecté" };
  }

  try {
    await prisma.subscription.delete({
      where: {
        userId_topicId: {
          userId: session.user.id,
          topicId,
        },
      },
    });

    revalidatePath("/profile");
    revalidatePath("/themes");
    revalidatePath("/feed");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors du désabonnement",
    };
  }
}

export async function getUserProfile() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      avatarUrl: true,
      subscriptions: {
        include: {
          topic: true,
        },
      },
    },
  });

  return user;
}
