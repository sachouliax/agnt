"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { AgentCard } from "@/components/AgentCard";
import type { Agent } from "@/lib/agents";

export default function AgentsPage() {
  const { t } = useLang();
  const [agents, setAgents] = useState<Agent[] | null>(null);

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(data.agents ?? []))
      .catch(() => setAgents([]));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">{t.agents.title}</h1>
      <p className="mt-2 max-w-xl text-muted">{t.agents.subtitle}</p>

      {agents === null && (
        <p className="mt-12 font-mono text-sm text-muted">…</p>
      )}

      {agents !== null && agents.length === 0 && (
        <div className="mt-12 rounded-none border border-dashed border-border p-10 text-center">
          <p className="text-muted">{t.agents.empty}</p>
          <Link
            href="/launch"
            className="mt-4 inline-block rounded-none bg-yellow px-5 py-2.5 font-semibold text-background"
          >
            {t.agents.emptyCta}
          </Link>
        </div>
      )}

      {agents !== null && agents.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
