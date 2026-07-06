import { NextResponse } from "next/server";
import { listAgents } from "@/lib/agents";

// Ranks creators by how many agents they've actually launched. Computed purely
// from the real onchain registry — every count here is backed by verifiable
// BNB Chain transactions, nothing is seeded or faked.
export async function GET() {
  const agents = await listAgents();

  const byCreator = new Map<string, { creator: string; agents: number; latest: number }>();
  for (const agent of agents) {
    const key = agent.creator.toLowerCase();
    const entry = byCreator.get(key);
    if (entry) {
      entry.agents += 1;
      entry.latest = Math.max(entry.latest, agent.createdAt);
    } else {
      byCreator.set(key, {
        creator: agent.creator,
        agents: 1,
        latest: agent.createdAt,
      });
    }
  }

  const entries = [...byCreator.values()].sort(
    (a, b) => b.agents - a.agents || b.latest - a.latest
  );

  return NextResponse.json({ entries });
}
