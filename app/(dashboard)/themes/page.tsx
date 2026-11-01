// app/(dashboard)/themes/page.tsx
import { getAllTopicsWithSubscriptionStatus } from "@/app/actions/theme.actions";
import ThemeCard from "@/app/components/themes/ThemeCard";

export default async function ThemesPage() {
  const topics = await getAllTopicsWithSubscriptionStatus();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Thèmes disponibles
        </h1>
        <p className="text-muted-foreground">
          Abonnez-vous aux thèmes qui vous intéressent pour personnaliser votre
          fil dactualité
        </p>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Aucun thème disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <ThemeCard
              key={topic.id}
              id={topic.id}
              name={topic.name}
              description={topic.description}
              isSubscribed={topic.isSubscribed}
              subscribersCount={topic._count.subscribers}
            />
          ))}
        </div>
      )}
    </div>
  );
}
