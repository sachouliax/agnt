"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Agent } from "@/lib/agents";

export function AgentCard({ agent }: { agent: Agent }) {
  const { t } = useLang();

  return (
    <Link
      href={`/agents/${agent.id}`}
      className="block rounded-none border border-border bg-surface p-5 transition-colors hover:border-yellow-dim"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-yellow font-mono font-bold text-background">
          {agent.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{agent.name}</p>
          <p className="text-xs text-yellow-dim">{agent.category}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm text-muted">{agent.description}</p>
      <p className="mt-4 truncate font-mono text-xs text-muted">
        {t.agents.creatorLabel}: {agent.creator.slice(0, 6)}…{agent.creator.slice(-4)}
      </p>
      <p className="mt-1 truncate font-mono text-xs text-yellow-dim">
        {t.agents.idLabel}: {agent.id.slice(0, 10)}…{agent.id.slice(-6)}
      </p>
    </Link>
  );
}
