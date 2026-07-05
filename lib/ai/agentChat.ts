import Anthropic from "@anthropic-ai/sdk";
import type { Agent } from "@/lib/agents";

let client: Anthropic | null = null;

function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

const MAX_REPLY_TOKENS = 300;

function buildSystemPrompt(agent: Agent) {
  return [
    `You are "${agent.name}", a small autonomous agent living onchain on BNB Chain, part of the AGNT registry.`,
    `Category: ${agent.category}.`,
    `Your defining behavior, as described by your creator: ${agent.description}`,
    "Stay fully in character as this agent. Keep replies short — 1 to 4 sentences, like a small onchain agent chatting, not a general-purpose assistant.",
    "You are not able to take real actions (trades, transactions, browsing) — you can only talk. If asked to do something, respond in character about how you'd approach it, without claiming to have actually done it.",
  ].join("\n");
}

export async function chatWithAgent(agent: Agent, userMessage: string) {
  const response = await getClient().messages.create({
    model: "claude-haiku-4-5",
    max_tokens: MAX_REPLY_TOKENS,
    system: buildSystemPrompt(agent),
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  return textBlock?.text ?? "";
}
