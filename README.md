# MDD - Monde de Dév

Réseau social pour développeurs.

## Description

MDD (Monde de Dév) est une plateforme permettant aux développeurs de s'abonner à des thèmes de programmation, de publier des articles et d'échanger via des commentaires.

## Fonctionnalités

- Inscription et connexion (identifiants e-mail ou nom d'utilisateur)
- Fil d'articles avec tri par date (plus récents / plus anciens)
- Création d'un article associé à un thème
- Page d'article avec commentaires
- Abonnement aux thèmes depuis la page Thèmes, désabonnement depuis le profil
- Gestion du profil (nom d'utilisateur, e-mail, mot de passe)
- Interface responsive : sous 768 px, la navigation passe dans un menu latéral ouvert par un bouton burger

## Stack technique

| Domaine          | Technologie                                                |
| ---------------- | ---------------------------------------------------------- |
| Framework        | Next.js 16 (App Router)                                    |
| Interface        | React 19, Tailwind CSS 4, lucide-react                     |
| Langage          | TypeScript 5                                               |
| Base de données  | PostgreSQL 17                                              |
| ORM              | Prisma 6                                                   |
| Authentification | Auth.js (next-auth v5), mots de passe hachés avec bcryptjs |
| Validation       | Zod 3                                                      |
| Tests            | Vitest 2 (unitaires et intégration), Playwright (E2E)      |

## Prérequis

- Node.js 20.9 ou supérieur (exigence de Next.js 16)
- npm
- Docker Desktop (pour la base de données)

## Installation

```bash
git clone <url-du-dépôt>
cd <dossier-du-projet>
npm install
```

### Base de données (Docker)

Lancer une instance PostgreSQL locale :

```bash
docker run --name mdd-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mdd_db -p 5433:5432 -d postgres:17
```

Le port **5433** de la machine est redirigé vers le port 5432 du conteneur, afin d'éviter un conflit avec une installation locale de PostgreSQL.

Arrêter et relancer le conteneur :

```bash
docker stop mdd-postgres
docker start mdd-postgres
```

### Configuration

1. Copier le fichier d'environnement :

```bash
cp .env.example .env
```

2. Renseigner les variables dans `.env` :

| Variable       | Rôle                                                | Valeur par défaut                                                                                    |
| -------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | Connexion à PostgreSQL                              | `postgresql://user:password@localhost:5433/mdd_db?schema=public` (correspond au conteneur ci-dessus) |
| `AUTH_SECRET`  | Secret utilisé par Auth.js pour signer les sessions | À générer                                                                                            |
| `AUTH_URL`     | URL de l'application                                | `http://localhost:3000`                                                                              |

Générer un `AUTH_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Initialisation de la base

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

- `prisma generate` génère le client Prisma.
- `prisma db push` crée les tables à partir de `prisma/schema.prisma` (le projet n'utilise pas de migrations).
- `prisma db seed` exécute `prisma/seed.ts`.

Le seed peut être relancé à tout moment : il remet les comptes de démonstration, leurs articles, commentaires et abonnements dans leur état d'origine.

### Données de démonstration

| E-mail             | Nom d'utilisateur | Mot de passe   |
| ------------------ | ----------------- | -------------- |
| `marouane@mdd.dev` | `marouane_dev`    | `Password123!` |
| `juana@mdd.dev`    | `juana_ui`        | `Password123!` |

Le seed crée aussi 7 thèmes (JavaScript, React, Web3, TypeScript, Python, DevOps, Intelligence Artificielle), 2 articles, 2 commentaires et les abonnements des deux comptes.

## Lancement

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

Pour tester la version de production :

```bash
npm run build
npm run start
```

## Scripts

| Commande                | Description                             |
| ----------------------- | --------------------------------------- |
| `npm run dev`           | Serveur de développement                |
| `npm run build`         | Build de production                     |
| `npm run start`         | Lance le build de production            |
| `npm run lint`          | Analyse du code avec ESLint             |
| `npm run test`          | Tests Vitest en mode watch              |
| `npm run test:ui`       | Interface graphique de Vitest           |
| `npm run test:coverage` | Tests Vitest avec rapport de couverture |
| `npx playwright test`   | Tests de bout en bout (E2E)             |

## Tests

### Tests unitaires et d'intégration (Vitest)

- **Unitaires** (`lib/**/*.test.ts`) : schémas de validation Zod, `formatDate`, `cn`.
- **Intégration** (`tests/integration/`) : les Server Actions (`app/actions`) sont appelées pour de vrai, sur la base PostgreSQL. La session (`@/auth`) et `revalidatePath` sont simulés avec `vi.mock`.
- Les fichiers de test s'exécutent les uns après les autres (`fileParallelism: false`), car ils partagent la même base.

```bash
npm run test
npm run test:coverage
```

Le rapport de couverture porte sur `lib/` et `app/actions/`, c'est-à-dire la logique métier. Les pages et composants sont couverts par les tests E2E, que Vitest ne mesure pas. Le rapport HTML est généré dans `coverage/`.

### Tests de bout en bout (Playwright)

Les scénarios sont dans `e2e/` : authentification, articles (création, commentaire, tri), thèmes (abonnement, désabonnement) et profil. Ils s'exécutent sur Chromium en format desktop.

```bash
npx playwright install chromium   # une seule fois
npx playwright test
npx playwright show-report
```

Playwright démarre automatiquement `npm run dev` si l'application n'est pas déjà lancée. La base doit être démarrée et initialisée (voir plus haut).

### Important : base de données partagée

Il n'existe pas de base dédiée aux tests : Vitest et Playwright utilisent la base définie dans `DATABASE_URL`. Chaque test crée ses propres données (préfixes `action_`, `e2e_`, etc.) et les supprime à la fin, et les tests E2E restaurent les comptes du seed qu'ils modifient. Si un test est interrompu en cours de route et laisse la base dans un état inattendu, relancer `npx prisma db seed` la remet en ordre.

## Architecture

- **Pages** : composants serveur (App Router), organisés en deux groupes de routes. `(auth)` regroupe la connexion et l'inscription, avec un en-tête réduit au logo. `(dashboard)` regroupe les pages de l'application, avec la navigation complète.
- **Mutations** : Server Actions dans `app/actions/` (création d'article, commentaire, abonnement, mise à jour du profil, inscription).
- **Validation** : chaque action valide les données avec un schéma Zod de `lib/validations/` avant tout accès à la base.
- **Authentification** : Auth.js avec le fournisseur `credentials` (configuration dans `auth.ts`). Les mots de passe sont hachés avec bcrypt.
- **Données** : Prisma. Les entités sont User, Topic, Article, Comment et Subscription, avec une table de liaison entre articles et thèmes.

## Structure du projet

```
.
├── app/
│   ├── (auth)/                       # Connexion et inscription
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/                  # Pages de l'application
│   │   ├── layout.tsx
│   │   ├── feed/page.tsx
│   │   ├── articles/
│   │   │   ├── [id]/page.tsx
│   │   │   └── new/page.tsx
│   │   ├── profile/page.tsx
│   │   └── themes/page.tsx
│   ├── actions/                      # Server Actions
│   │   ├── article.actions.ts
│   │   ├── auth.actions.ts
│   │   ├── comment.actions.ts
│   │   ├── profile.actions.ts
│   │   └── theme.actions.ts
│   ├── api/auth/[...nextauth]/route.ts
│   ├── components/
│   │   ├── articles/                 # ArticleCard, CommentItem, CommentForm, CreateArticleForm
│   │   ├── feed/                     # SortSelect
│   │   ├── layout/                   # Header, HeaderNav, NavLink, ProfileLink
│   │   ├── profile/                  # ProfileForm, SubscriptionsList
│   │   ├── themes/                   # ThemeCard
│   │   └── ui/                       # Composants réutilisables (Button, TextField, TopicCard...)
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── e2e/                              # Tests Playwright
│   ├── helpers/auth.ts
│   └── *.spec.ts
├── lib/
│   ├── validations/                  # Schémas Zod et leurs tests
│   ├── formatDate.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/                           # Fichiers statiques (logo)
├── tests/integration/                # Tests d'intégration des Server Actions
├── auth.ts                           # Configuration Auth.js
├── next.config.ts
├── playwright.config.ts
├── vitest.config.ts
├── .env.example
└── package.json
```

## Dépannage

- **`Can't reach database server`** : le conteneur n'est pas lancé. Exécuter `docker start mdd-postgres` et vérifier que le port de `DATABASE_URL` est bien 5433.
- **Port 5433 déjà utilisé** : changer le port de gauche dans la commande `docker run` et dans `DATABASE_URL`.
- **Erreur liée à `AUTH_SECRET`** : la variable est absente ou vide dans `.env`. Redémarrer ensuite `npm run dev`.
- **Données incohérentes après des tests** : relancer `npx prisma db seed`.

## Documentation

- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Auth.js](https://authjs.dev)
- [Zod](https://zod.dev)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev/docs/intro)

## Licence

MIT License
