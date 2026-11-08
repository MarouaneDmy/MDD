import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding de la base de données...");

  // CRÉATION DE TOUS LES THÈMES (Indépendants)
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

  const topicTS = await prisma.topic.upsert({
    where: { name: "TypeScript" },
    update: {},
    create: {
      name: "TypeScript",
      description:
        "Le sur-ensemble de JavaScript qui ajoute du typage statique",
    },
  });

  const topicPython = await prisma.topic.upsert({
    where: { name: "Python" },
    update: {},
    create: {
      name: "Python",
      description: "Langage de programmation polyvalent et populaire",
    },
  });

  const topicDevOps = await prisma.topic.upsert({
    where: { name: "DevOps" },
    update: {},
    create: {
      name: "DevOps",
      description:
        "Pratiques et outils pour l'automatisation et le déploiement",
    },
  });

  const topicAI = await prisma.topic.upsert({
    where: { name: "Intelligence Artificielle" },
    update: {},
    create: {
      name: "Intelligence Artificielle",
      description: "Machine Learning, Deep Learning et IA générative",
    },
  });

  // CRÉATION DES UTILISATEURS
  const hashedPassword = await bcrypt.hash("password123", 10);

  const userMarouane = await prisma.user.upsert({
    where: { email: "marouane@mdd.dev" },
    update: {},
    create: {
      email: "marouane@mdd.dev",
      username: "marouane_dev",
      password: hashedPassword,
      bio: "Développeur Full-Stack passionné par Next.js et TypeScript.",
    },
  });

  const userJuana = await prisma.user.upsert({
    where: { email: "juana@mdd.dev" },
    update: {},
    create: {
      email: "juana@mdd.dev",
      username: "juana_ui",
      password: hashedPassword,
      bio: "Designer UI/UX et créatrice de MDD.",
    },
  });

  // CRÉATION DES ARTICLES (Avec nettoyage préalable)
  await prisma.article.deleteMany({
    where: {
      authorId: {
        in: [userMarouane.id, userJuana.id],
      },
    },
  });

  const article1 = await prisma.article.create({
    data: {
      title: "Pourquoi TypeScript est incontournable en 2024",
      content:
        "TypeScript ajoute un typage statique à JavaScript, ce qui réduit les bugs et améliore la maintenabilité...",
      authorId: userMarouane.id,
      topics: {
        create: [{ topicId: topicJS.id }, { topicId: topicTS.id }],
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

  // CRÉATION DES COMMENTAIRES (Avec nettoyage préalable)
  await prisma.comment.deleteMany({
    where: {
      authorId: {
        in: [userMarouane.id, userJuana.id],
      },
    },
  });

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

  // CRÉATION DES ABONNEMENTS (Dépendent des Users et Topics)
  await prisma.subscription.deleteMany({
    where: {
      userId: {
        in: [userMarouane.id, userJuana.id],
      },
    },
  });

  await prisma.subscription.createMany({
    data: [
      { userId: userMarouane.id, topicId: topicReact.id },
      { userId: userMarouane.id, topicId: topicWeb3.id },
      { userId: userMarouane.id, topicId: topicTS.id },
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
