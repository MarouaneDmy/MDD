// app/actions/article.actions.ts
"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

// Schéma de validation pour la création d'article
const articleSchema = z.object({
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

export async function createArticle(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Vous devez être connecté pour créer un article",
    };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const topicIds = formData.getAll("topics") as string[];

  // Validation avec Zod
  const validatedData = articleSchema.safeParse({ title, content, topicIds });

  if (!validatedData.success) {
    return {
      success: false,
      error: validatedData.error.issues[0].message,
    };
  }

  try {
    const article = await prisma.article.create({
      data: {
        title: validatedData.data.title,
        content: validatedData.data.content,
        authorId: session.user.id,
        topics: {
          create: validatedData.data.topicIds.map((topicId) => ({
            topicId,
          })),
        },
      },
    });

    // Revalider le fil d'actualité
    revalidatePath("/feed");

    return { success: true, articleId: article.id };
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de l'article",
    };
  }
}

// Fonction utilitaire pour récupérer tous les thèmes
export async function getAllTopics() {
  return await prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });
}
