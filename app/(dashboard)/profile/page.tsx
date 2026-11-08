// app/(dashboard)/profile/page.tsx
import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/actions/profile.actions";
import ProfileForm from "@/app/components/profile/ProfileForm";
import SubscriptionsList from "@/app/components/profile/SubscriptionsList";
import PageContainer from "@/app/components/ui/PageContainer";

export default async function ProfilePage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/login");
  }

  const subscriptionsWithId = user.subscriptions.map((sub) => ({
    id: `${sub.userId}-${sub.topicId}`,
    topic: sub.topic,
  }));

  return (
    <PageContainer>
      <section>
        <h1 className="mb-6 text-center text-lg font-bold text-black">
          Profil utilisateur
        </h1>
        <ProfileForm username={user.username} email={user.email} />
      </section>

      <hr className="my-8 border-gray-500" />

      <section>
        <h2 className="mb-4 text-center text-lg font-bold text-black">
          Abonnements
        </h2>
        <SubscriptionsList subscriptions={subscriptionsWithId} />
      </section>
    </PageContainer>
  );
}
