import { toHex } from "viem";

export function encodeAgentPayload(input: {
  name: string;
  category: string;
  description: string;
}) {
  const json = JSON.stringify({
    app: "AGNT",
    n: input.name,
    c: input.category,
    d: input.description,
  });
  return toHex(json);
}
