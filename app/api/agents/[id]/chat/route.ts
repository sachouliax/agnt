import { NextRequest, NextResponse } from "next/server";
import { listAgents } from "@/lib/agents";
import { chatWithAgent } from "@/lib/ai/agentChat";
import { chatRatelimit } from "@/lib/ratelimit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (chatRatelimit) {
    const { success } = await chatRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const message = ((body as { message?: string })?.message ?? "").trim();
  if (message.length < 1 || message.length > 500) {
    return NextResponse.json({ error: "invalid_message" }, { status: 400 });
  }

  const agents = await listAgents();
  const agent = agents.find((a) => a.id.toLowerCase() === id.toLowerCase());
  if (!agent) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const reply = await chatWithAgent(agent, message);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "chat_failed" }, { status: 502 });
  }
}
