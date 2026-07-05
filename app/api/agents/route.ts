import { NextRequest, NextResponse } from "next/server";
import { createAgent, listAgents, validateAgentInput } from "@/lib/agents";
import { verifyAgentTransaction } from "@/lib/web3/verify";

export async function GET() {
  const agents = await listAgents();
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const result = validateAgentInput(body as Record<string, string>);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const verified = await verifyAgentTransaction(result.value.txHash, result.value.creator);
  if (!verified.ok) {
    return NextResponse.json({ error: verified.error }, { status: 400 });
  }

  const agent = await createAgent(result.value);
  return NextResponse.json({ agent }, { status: 201 });
}
