import { NextResponse } from "next/server";
import { listAgents } from "@/lib/agents";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agents = await listAgents();
  const agent = agents.find((a) => a.id.toLowerCase() === id.toLowerCase());

  if (!agent) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ agent });
}
