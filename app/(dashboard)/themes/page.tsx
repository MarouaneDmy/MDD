import { getAllTopicsWithSubscriptionStatus } from "@/app/actions/theme.actions";
import ThemeCard from "@/app/components/themes/ThemeCard";

export default async function ThemesPage() {
  const topics = await getAllTopicsWithSubscriptionStatus();

  return (
    <div className="container mx-auto px-6 py-6">
      <h1 className="sr-only">Thèmes disponibles</h1>

      {topics.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-lg">Aucun thème disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {topics.map((topic) => (
            <ThemeCard
              key={topic.id}
              id={topic.id}
              name={topic.name}
              description={topic.description}
              isSubscribed={topic.isSubscribed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
