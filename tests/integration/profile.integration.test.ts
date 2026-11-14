import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

import { auth } from "@/auth";
import {
  updateProfile,
  unsubscribeFromTopic,
} from "@/app/actions/profile.actions";

const prisma = new PrismaClient();

describe("Test d'Intégration : Actions Profil", () => {
  let testUserId: string;
  let testTopicId: string;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    const user = await prisma.user.create({
      data: {
        email: "test_profile@mdd.dev",
        username: "test_profile_user",
        password: hashedPassword,
      },
    });
    testUserId = user.id;

    let topic = await prisma.topic.findFirst();
    if (!topic) {
      topic = await prisma.topic.create({
        data: { name: "Test Topic", description: "Pour les tests" },
      });
    }
    testTopicId = topic.id;

    await prisma.subscription.create({
      data: { userId: testUserId, topicId: testTopicId },
    });

    const mockAuth = vi.mocked(auth as unknown as () => Promise<unknown>);
    mockAuth.mockResolvedValue({
      user: {
        id: testUserId,
        email: "test_profile@mdd.dev",
        username: "test_profile_user",
      },
    });
  });

  afterAll(async () => {
    await prisma.subscription.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("devrait mettre à jour le username et l'email avec succès", async () => {
    const formData = new FormData();
    formData.append("username", "updated_user");
    formData.append("email", "updated@mdd.dev");
    formData.append("password", "");

    const result = await updateProfile(formData);
    console.log("🔍 RÉSULTAT TEST 1:", result);

    expect(result.success).toBe(true);

    const updatedUser = await prisma.user.findUnique({
      where: { id: testUserId },
    });
    expect(updatedUser?.username).toBe("updated_user");
    expect(updatedUser?.email).toBe("updated@mdd.dev");
  });

  it("devrait mettre à jour le mot de passe et le hacher", async () => {
    const formData = new FormData();
    formData.append("username", "test_profile_user");
    formData.append("email", "test_profile@mdd.dev");
    formData.append("password", "NewSecurePassword123!");

    const result = await updateProfile(formData);
    console.log("🔍 RÉSULTAT TEST 2:", result);

    expect(result.success).toBe(true);

    const updatedUser = await prisma.user.findUnique({
      where: { id: testUserId },
    });
    expect(updatedUser?.password).not.toBe("NewSecurePassword123!");

    const isMatch = await bcrypt.compare(
      "NewSecurePassword123!",
      updatedUser!.password,
    );
    expect(isMatch).toBe(true);
  });

  it("devrait permettre de se désabonner d'un thème", async () => {
    const result = await unsubscribeFromTopic(testTopicId);
    console.log("🔍 RÉSULTAT TEST 3:", result);

    expect(result.success).toBe(true);

    const subscription = await prisma.subscription.findUnique({
      where: { userId_topicId: { userId: testUserId, topicId: testTopicId } },
    });
    expect(subscription).toBeNull();
  });
});
