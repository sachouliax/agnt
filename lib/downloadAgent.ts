import type { Agent } from "./agents";
import { buildAgentSpec } from "./agentSpec";

// Exports a deployed agent as a complete, portable, runnable spec file.
// It carries the agent's identity, its onchain proof, AND its runtime brain
// (system prompt + model) — so it can be shared, re-imported, or dropped into
// any Claude-compatible runtime to reproduce the exact same agent.
export function downloadAgent(agent: Agent) {
  const spec = buildAgentSpec(agent);

  const blob = new Blob([JSON.stringify(spec, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeName = agent.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "agent";
  a.href = url;
  a.download = `${safeName}.agnt.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
