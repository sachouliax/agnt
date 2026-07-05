import { NextRequest, NextResponse } from "next/server";
import { parseEther } from "viem";
import { listAgents } from "@/lib/agents";
import { getRental, createRental } from "@/lib/rentals";
import { verifyRentTransaction } from "@/lib/web3/verify";
import { RENT_DURATION_SECONDS, RENT_PRICE_BNB } from "@/lib/config";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rental = await getRental(id);
  return NextResponse.json({ rental });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const agents = await listAgents();
  const agent = agents.find((a) => a.id.toLowerCase() === id.toLowerCase());
  if (!agent) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const existing = await getRental(id);
  if (existing) {
    return NextResponse.json({ error: "already_rented" }, { status: 409 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { txHash, renter } = (body ?? {}) as { txHash?: string; renter?: string };
  if (
    !txHash ||
    !renter ||
    !/^0x[0-9a-fA-F]{64}$/.test(txHash) ||
    !/^0x[0-9a-fA-F]{40}$/.test(renter)
  ) {
    return NextResponse.json({ error: "invalid_format" }, { status: 400 });
  }

  const verified = await verifyRentTransaction(txHash, renter, parseEther(RENT_PRICE_BNB));
  if (!verified.ok) {
    return NextResponse.json({ error: verified.error }, { status: 400 });
  }

  const rental = await createRental(id, renter, txHash, RENT_DURATION_SECONDS);
  return NextResponse.json({ rental }, { status: 201 });
}
