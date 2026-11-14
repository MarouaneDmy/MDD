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
  const hashedPassword = await bcrypt.hash("Password123!", 10);

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
      content: `Depuis ses débuts, JavaScript a dominé le développement web grâce à sa flexibilité. Cependant, cette liberté a souvent été synonyme de bugs difficiles à traquer, surtout lorsque la taille d'un projet augmente. C'est ici que TypeScript entre en jeu.

TypeScript, développé par Microsoft, ajoute un typage statique optionnel à JavaScript. Cela permet de détecter les erreurs dès la phase de compilation, bien avant que le code n'atteigne le navigateur. Fini les "undefined is not a function" qui apparaissent uniquement en production !

Au-delà de la sécurité, TypeScript offre une expérience développeur (DX) inégalée. L'autocomplétion dans votre IDE devient incroyablement précise, et le refactoring de grosses bases de code se fait en toute confiance. 

Aujourd'hui, en 2024, TypeScript n'est plus une simple option. Il est devenu le standard de l'industrie, adopté par les plus grands frameworks comme React, Angular, Vue, et même Node.js. Ne pas l'utiliser, c'est se priver de l'outil le plus puissant pour maintenir un code propre et évolutif.`,
      authorId: userMarouane.id,
      topics: {
        create: [{ topicId: topicJS.id }, { topicId: topicTS.id }],
      },
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "Les bases du Web3 pour les développeurs Front-end",
      content: `Le Web3 représente un changement de paradigme majeur sur Internet. Contrairement au Web2, où les données sont contrôlées par des géants centralisés (GAFAM), le Web3 repose sur la décentralisation, la blockchain et la propriété des données par les utilisateurs.

Mais quel est le rôle d'un développeur Front-end dans tout ça ? En réalité, il est central. Le Front-end est le pont entre l'utilisateur et la blockchain. Votre mission sera de connecter le navigateur à des portefeuilles numériques (comme MetaMask) et d'interagir avec des "Smart Contracts" déployés sur la blockchain.

Pour ce faire, vous utiliserez des bibliothèques comme ethers.js, viem ou wagmi. Elles vous permettent de lire des données sur la blockchain (comme le solde d'un token) ou d'écrire des données (comme effectuer une transaction). 

Cependant, le Web3 apporte son lot de défis UX : les transactions ne sont pas instantanées, elles coûtent de l'argent (le "gas"), et l'utilisateur doit valider chaque action dans son wallet. Concevoir une interface fluide qui masque cette complexité est le véritable défi du développeur Front-end Web3 aujourd'hui.`,
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
