import Anthropic from "@anthropic-ai/sdk";
import type { Agent } from "@/lib/agents";
import { AGENT_MODEL, buildSystemPrompt } from "@/lib/agentSpec";

let client: Anthropic | null = null;

function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

const MAX_REPLY_TOKENS = 300;

export async function chatWithAgent(agent: Agent, userMessage: string) {
  const response = await getClient().messages.create({
    model: AGENT_MODEL,
    max_tokens: MAX_REPLY_TOKENS,
    system: buildSystemPrompt(agent),
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  return textBlock?.text ?? "";
}
