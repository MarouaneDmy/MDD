"use server";

import { auth } from "@/auth";
import { commentSchema } from "@/lib/validations/comment.schema";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function addComment(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Vous devez être connecté pour commenter" };
  }

  const content = formData.get("content") as string;
  const articleId = formData.get("articleId") as string;

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

    revalidatePath(`/articles/${articleId}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de l'ajout du commentaire",
    };
  }
}
