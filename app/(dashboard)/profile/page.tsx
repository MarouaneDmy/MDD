// app/(dashboard)/profile/page.tsx
import { getUserProfile } from "@/app/actions/profile.actions";
import { redirect } from "next/navigation";
import ProfileForm from "@/app/components/profile/ProfileForm";
import SubscriptionsList from "@/app/components/profile/SubscriptionsList";

export default async function ProfilePage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/login");
  }

  // 👇 Mapper les subscriptions pour ajouter un "id" virtuel
  const subscriptionsWithId = user.subscriptions.map((sub) => ({
    id: `${sub.userId}-${sub.topicId}`,
    topic: sub.topic,
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground text-center mb-8">
        Profil utilisateur
      </h1>

      <section className="mb-12">
        <ProfileForm username={user.username} email={user.email} />
      </section>

      <hr className="border-border my-12" />

      <section>
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">
          Abonnements
        </h2>
        <SubscriptionsList subscriptions={subscriptionsWithId} />
      </section>
    </div>
  );
}
