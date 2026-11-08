"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { unsubscribeFromTopic } from "@/app/actions/profile.actions";
import TopicCard from "@/app/components/ui/TopicCard";
import { Button } from "@/app/components/ui/Button";

interface Topic {
  id: string;
  name: string;
  description: string | null;
}

interface SubscriptionsListProps {
  subscriptions: Array<{
    id: string;
    topic: Topic;
  }>;
}

export default function SubscriptionsList({
  subscriptions,
}: SubscriptionsListProps) {
  const router = useRouter();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  async function handleUnsubscribe(topicId: string) {
    setLoadingIds((prev) => new Set(prev).add(topicId));

    const result = await unsubscribeFromTopic(topicId);

    if (result.success) {
      router.refresh();
      return;
    }

    setLoadingIds((prev) => {
      const next = new Set(prev);
      next.delete(topicId);
      return next;
    });
  }

  if (subscriptions.length === 0) {
    return (
      <div className="py-8 text-center text-gray-600">
        <p>Vous n&apos;êtes abonné à aucun thème pour le moment.</p>
        <p className="mt-2 text-sm">
          <Link href="/themes" className="text-primary hover:underline">
            Parcourir les thèmes
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {subscriptions.map(({ id, topic }) => (
        <TopicCard
          key={id}
          name={topic.name}
          description={topic.description}
          headingLevel="h3"
        >
          <Button
            onClick={() => handleUnsubscribe(topic.id)}
            disabled={loadingIds.has(topic.id)}
            className="w-36"
          >
            {loadingIds.has(topic.id) ? "..." : "Se désabonner"}
          </Button>
        </TopicCard>
      ))}
    </div>
  );
}
