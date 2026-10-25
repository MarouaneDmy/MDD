// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding de la base de données...");

  // 1. Création des Thèmes (Topics)
  const topicJS = await prisma.topic.upsert({
    where: { name: "JavaScript" },
    update: {},
    create: { name: "JavaScript", description: "Tout sur le langage JS" },
  });

  const topicReact = await prisma.topic.upsert({
    where: { name: "React" },
    update: {},
    create: { name: "React", description: "La bibliothèque UI de Meta" },
  });

  const topicWeb3 = await prisma.topic.upsert({
    where: { name: "Web3" },
    update: {},
    create: { name: "Web3", description: "Blockchain et décentralisation" },
  });

  // 2. Création des Utilisateurs
  const userMarouane = await prisma.user.upsert({
    where: { email: "marouane@mdd.dev" },
    update: {},
    create: {
      email: "marouane@mdd.dev",
      username: "marouane_dev",
      password: "$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm", // "password123" haché avec bcrypt
      bio: "Développeur Full-Stack passionné par Next.js et TypeScript.",
    },
  });

  const userJuana = await prisma.user.upsert({
    where: { email: "juana@mdd.dev" },
    update: {},
    create: {
      email: "juana@mdd.dev",
      username: "juana_ui",
      password: "$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm", // "password123"
      bio: "Designer UI/UX et créatrice de MDD.",
    },
  });

  // 3. Création des Articles
  const article1 = await prisma.article.create({
    data: {
      title: "Pourquoi TypeScript est incontournable en 2024",
      content:
        "TypeScript ajoute un typage statique à JavaScript, ce qui réduit les bugs et améliore la maintenabilité...",
      authorId: userMarouane.id,
      topics: {
        create: [{ topicId: topicJS.id }, { topicId: topicReact.id }],
      },
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "Les bases du Web3 pour les développeurs Front-end",
      content:
        "Le Web3 change la façon dont nous pensons les applications décentralisées. Voici un guide pour débuter...",
      authorId: userJuana.id,
      topics: {
        create: [{ topicId: topicWeb3.id }],
      },
    },
  });

  // 4. Création des Commentaires
  await prisma.comment.create({
    data: {
      content:
        "Super article ! Je suis totalement d'accord sur l'importance du typage.",
      authorId: userJuana.id,
      articleId: article1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Merci pour ce résumé clair, ça m'aide beaucoup pour me lancer.",
      authorId: userMarouane.id,
      articleId: article2.id,
    },
  });

  // 5. Création des Abonnements (Marouane s'abonne à React et Web3)
  await prisma.subscription.createMany({
    data: [
      { userId: userMarouane.id, topicId: topicReact.id },
      { userId: userMarouane.id, topicId: topicWeb3.id },
      { userId: userJuana.id, topicId: topicJS.id },
    ],
  });

  console.log("✅ Seeding terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
