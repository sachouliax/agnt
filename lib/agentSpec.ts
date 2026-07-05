import type { Agent } from "./agents";
import { BSCSCAN_TX_BASE, BSC_CHAIN_ID, REGISTRY_ADDRESS } from "./config";

export const AGENT_MODEL = "claude-haiku-4-5";

// Single source of truth for an agent's "brain". Both the live chat endpoint
// and the downloadable .agnt.json file derive from this — so the exported file
// genuinely reproduces the same agent you can talk to on the site.
// No secrets here: safe to import on the client.
export function buildSystemPrompt(agent: Agent): string {
  const lines = [
    `You are "${agent.name}", a small autonomous agent living onchain on BNB Chain, part of the AGNT registry.`,
    `Category: ${agent.category}.`,
  ];
  if (agent.personality) {
    lines.push(`Personality / tone: ${agent.personality}. Let this shape how you speak.`);
  }
  lines.push(
    `Your defining behavior, as described by your creator: ${agent.description}`,
    "Stay fully in character as this agent. Keep replies short — 1 to 4 sentences, like a small onchain agent chatting, not a general-purpose assistant.",
    "You are not able to take real actions (trades, transactions, browsing) — you can only talk. If asked to do something, respond in character about how you'd approach it, without claiming to have actually done it."
  );
  return lines.join("\n");
}

export function buildGreeting(agent: Agent): string {
  return `gm — I'm ${agent.name}. ${agent.category} agent, live onchain on BNB Chain. What do you want?`;
}

// A complete, portable agent definition. Load `runtime.systemPrompt` into any
// Claude-compatible call and you get the exact same agent back.
export function buildAgentSpec(agent: Agent) {
  return {
    format: "agnt-agent",
    version: 2,
    identity: {
      id: agent.id,
      name: agent.name,
      category: agent.category,
      personality: agent.personality || null,
      description: agent.description,
      creator: agent.creator,
      createdAt: agent.createdAt,
    },
    runtime: {
      provider: "anthropic",
      model: AGENT_MODEL,
      systemPrompt: buildSystemPrompt(agent),
      greeting: buildGreeting(agent),
      maxTokens: 300,
    },
    chain: {
      name: "BNB Chain",
      chainId: BSC_CHAIN_ID,
      registry: REGISTRY_ADDRESS,
      proof: `${BSCSCAN_TX_BASE}${agent.id}`,
    },
  };
}
