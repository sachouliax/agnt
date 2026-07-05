import { toHex } from "viem";

export function encodeAgentPayload(input: {
  name: string;
  category: string;
  personality: string;
  description: string;
}) {
  const json = JSON.stringify({
    app: "AGNT",
    n: input.name,
    c: input.category,
    p: input.personality,
    d: input.description,
  });
  return toHex(json);
}

export function encodeRentPayload(input: { agentId: string }) {
  const json = JSON.stringify({
    app: "AGNT",
    action: "rent",
    agent: input.agentId,
  });
  return toHex(json);
}
