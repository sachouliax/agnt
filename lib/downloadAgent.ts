import type { Agent } from "./agents";
import { BSCSCAN_TX_BASE, BSC_CHAIN_ID, REGISTRY_ADDRESS } from "./config";

// Exports a deployed agent as a portable, self-describing manifest file.
// This is the "install / export" artifact: it carries the agent's identity
// plus its onchain proof, so it can be shared or re-imported later.
export function downloadAgent(agent: Agent) {
  const manifest = {
    format: "agnt-agent",
    version: 1,
    id: agent.id,
    name: agent.name,
    category: agent.category,
    description: agent.description,
    creator: agent.creator,
    createdAt: agent.createdAt,
    chain: { name: "BNB Chain", chainId: BSC_CHAIN_ID },
    registry: REGISTRY_ADDRESS,
    proof: `${BSCSCAN_TX_BASE}${agent.id}`,
  };

  const blob = new Blob([JSON.stringify(manifest, null, 2)], {
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
