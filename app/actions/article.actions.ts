"use server";

import { auth } from "@/auth";
import { articleSchema } from "@/lib/validations/article.schema";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

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

    revalidatePath("/feed");

    return { success: true, articleId: article.id };
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de l'article",
    };
  }
}

export async function getAllTopics() {
  return await prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });
}
