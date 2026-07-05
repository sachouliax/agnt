import { redis } from "./redis";

export type Agent = {
  id: string; // the onchain transaction hash — the real proof
  name: string;
  category: string;
  personality: string; // tone/persona chosen at creation
  description: string;
  creator: string; // wallet address that signed the transaction
  createdAt: number;
};

const REDIS_KEY = "agnt:agents";
const MAX_AGENTS = 200;

// Fallback store used when Upstash env vars are not configured (e.g. local dev).
// Not persisted across server restarts.
const memoryStore: Agent[] = [];

export type CreateAgentInput = {
  name: string;
  category: string;
  personality: string;
  description: string;
  txHash: string;
  creator: string;
};

export function validateAgentInput(input: Partial<CreateAgentInput>) {
  const name = (input.name ?? "").trim();
  const description = (input.description ?? "").trim();
  const category = (input.category ?? "Other").trim();
  const personality = (input.personality ?? "").trim().slice(0, 40);
  const txHash = (input.txHash ?? "").trim();
  const creator = (input.creator ?? "").trim();

  if (name.length < 2 || name.length > 40) {
    return { ok: false as const, error: "name" as const };
  }
  if (description.length < 10 || description.length > 280) {
    return { ok: false as const, error: "description" as const };
  }
  if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    return { ok: false as const, error: "txHash" as const };
  }
  if (!/^0x[0-9a-fA-F]{40}$/.test(creator)) {
    return { ok: false as const, error: "creator" as const };
  }
  return {
    ok: true as const,
    value: { name, category, personality, description, txHash, creator },
  };
}

export async function createAgent(input: CreateAgentInput): Promise<Agent> {
  const agent: Agent = {
    id: input.txHash,
    name: input.name,
    category: input.category,
    personality: input.personality,
    description: input.description,
    creator: input.creator,
    createdAt: Date.now(),
  };

  if (redis) {
    await redis.lpush(REDIS_KEY, JSON.stringify(agent));
    await redis.ltrim(REDIS_KEY, 0, MAX_AGENTS - 1);
  } else {
    memoryStore.unshift(agent);
    memoryStore.length = Math.min(memoryStore.length, MAX_AGENTS);
  }

  return agent;
}

export async function listAgents(): Promise<Agent[]> {
  if (redis) {
    const raw = await redis.lrange<string | Agent>(REDIS_KEY, 0, MAX_AGENTS - 1);
    return raw.map((item) => {
      const parsed: Agent = typeof item === "string" ? JSON.parse(item) : item;
      // Older records predate the personality field.
      return { ...parsed, personality: parsed.personality ?? "" };
    });
  }
  return memoryStore;
}
