"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function toggleSubscription(topicId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Vous devez être connecté" };
  }

  const userId = session.user.id;

  try {
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId,
        },
      },
    });

    if (existingSubscription) {
      await prisma.subscription.delete({
        where: {
          userId_topicId: {
            userId,
            topicId,
          },
        },
      });

      revalidatePath("/themes");
      revalidatePath("/feed");

      return { success: true, action: "unsubscribed" };
    } else {
      await prisma.subscription.create({
        data: {
          userId,
          topicId,
        },
      });

      revalidatePath("/themes");
      revalidatePath("/feed");

      return { success: true, action: "subscribed" };
    }
  } catch (error) {
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getAllTopicsWithSubscriptionStatus() {
  const session = await auth();
  const userId = session?.user?.id;

  const topics = await prisma.topic.findMany({
    include: {
      _count: {
        select: {
          subscribers: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  if (userId) {
    const userSubscriptions = await prisma.subscription.findMany({
      where: { userId },
      select: { topicId: true },
    });

    const subscribedTopicIds = new Set(userSubscriptions.map((s) => s.topicId));

    return topics.map((topic) => ({
      ...topic,
      isSubscribed: subscribedTopicIds.has(topic.id),
    }));
  }

  return topics.map((topic) => ({
    ...topic,
    isSubscribed: false,
  }));
}
