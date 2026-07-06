"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { BSCSCAN_ADDRESS_BASE } from "@/lib/config";

type Entry = { creator: string; agents: number; latest: number };

const medal = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const { t } = useLang();
  const [entries, setEntries] = useState<Entry[] | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setEntries([]));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">{t.leaderboard.title}</h1>
      <p className="mt-2 max-w-xl text-muted">{t.leaderboard.subtitle}</p>

      <section className="mt-8 border border-yellow-dim bg-surface p-5">
        <p className="font-mono text-xs tracking-widest text-yellow">
          {t.leaderboard.rewardsTitle.toUpperCase()}
        </p>
        <p className="mt-3 text-sm text-muted">{t.leaderboard.rewardsText}</p>
      </section>

      {entries === null && (
        <p className="mt-12 font-mono text-sm text-muted">…</p>
      )}

      {entries !== null && entries.length === 0 && (
        <div className="mt-12 border border-dashed border-border p-10 text-center">
          <p className="text-muted">{t.leaderboard.empty}</p>
          <Link
            href="/launch"
            className="mt-4 inline-block bg-yellow px-5 py-2.5 font-semibold text-background"
          >
            {t.leaderboard.emptyCta}
          </Link>
        </div>
      )}

      {entries !== null && entries.length > 0 && (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-border text-left text-yellow-dim">
                <th className="py-3 pr-4">{t.leaderboard.colRank}</th>
                <th className="py-3 pr-4">{t.leaderboard.colCreator}</th>
                <th className="py-3 text-right tabular-nums">
                  {t.leaderboard.colAgents}
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.creator} className="border-b border-border">
                  <td className="py-3 pr-4 text-muted">
                    {i < 3 ? medal[i] : i + 1}
                  </td>
                  <td className="py-3 pr-4">
                    <a
                      href={`${BSCSCAN_ADDRESS_BASE}${entry.creator}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow underline decoration-yellow-dim underline-offset-4 hover:text-foreground"
                    >
                      {entry.creator.slice(0, 6)}…{entry.creator.slice(-4)} ↗
                    </a>
                  </td>
                  <td className="py-3 text-right tabular-nums text-foreground">
                    {entry.agents}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
