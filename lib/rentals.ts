import { redis } from "./redis";

export type Rental = {
  renter: string;
  txHash: string;
  startedAt: number;
  expiresAt: number;
};

const PREFIX = "agnt:rental:";

// Fallback store used when Upstash env vars are not configured (e.g. local dev).
const memoryStore = new Map<string, Rental>();

export async function getRental(agentId: string): Promise<Rental | null> {
  if (redis) {
    const raw = await redis.get<Rental | string>(PREFIX + agentId);
    if (!raw) return null;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  }
  const rental = memoryStore.get(agentId);
  if (!rental) return null;
  if (rental.expiresAt < Date.now()) {
    memoryStore.delete(agentId);
    return null;
  }
  return rental;
}

export async function createRental(
  agentId: string,
  renter: string,
  txHash: string,
  durationSeconds: number
): Promise<Rental> {
  const startedAt = Date.now();
  const expiresAt = startedAt + durationSeconds * 1000;
  const rental: Rental = { renter, txHash, startedAt, expiresAt };

  if (redis) {
    await redis.set(PREFIX + agentId, JSON.stringify(rental), { ex: durationSeconds });
  } else {
    memoryStore.set(agentId, rental);
  }

  return rental;
}
