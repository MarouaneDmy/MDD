"use client";

import { useState } from "react";
import { unsubscribeFromTopic } from "@/app/actions/profile.actions";

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
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  async function handleUnsubscribe(topicId: string) {
    setLoadingIds((prev) => new Set(prev).add(topicId));

    const result = await unsubscribeFromTopic(topicId);

    if (result.success) {
      // Recharger la page pour mettre à jour la liste
      window.location.reload();
    }

    setLoadingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(topicId);
      return newSet;
    });
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Vous nêtes abonné à aucun thème pour le moment.</p>
        <p className="text-sm mt-2">
          <a href="/themes" className="text-primary hover:underline">
            Parcourir les thèmes
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {subscriptions.map((subscription) => (
        <div
          key={subscription.id}
          className="bg-card border border-border rounded-lg p-4"
        >
          <h3 className="font-semibold text-foreground mb-2">
            {subscription.topic.name}
          </h3>
          {subscription.topic.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {subscription.topic.description}
            </p>
          )}
          <button
            onClick={() => handleUnsubscribe(subscription.topic.id)}
            disabled={loadingIds.has(subscription.topic.id)}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loadingIds.has(subscription.topic.id) ? "..." : "Se désabonner"}
          </button>
        </div>
      ))}
    </div>
  );
}
