"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

// Schéma de validation pour le commentaire
const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(1000, "Le commentaire est trop long"),
  articleId: z.string().cuid(),
});

export async function addComment(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Vous devez être connecté pour commenter" };
  }

  const content = formData.get("content") as string;
  const articleId = formData.get("articleId") as string;

  // Validation avec Zod
  const validatedData = commentSchema.safeParse({ content, articleId });

  if (!validatedData.success) {
    return {
      success: false,
      error: validatedData.error.issues[0].message,
    };
  }

  try {
    await prisma.comment.create({
      data: {
        content: validatedData.data.content,
        articleId: validatedData.data.articleId,
        authorId: session.user.id,
      },
    });

    // Revalider la page pour afficher le nouveau commentaire
    revalidatePath(`/articles/${articleId}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de l'ajout du commentaire",
    };
  }
}
