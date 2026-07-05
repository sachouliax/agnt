import { createPublicClient, http, isAddress, isHash } from "viem";
import { bsc } from "viem/chains";
import { REGISTRY_ADDRESS } from "@/lib/config";

const publicClient = createPublicClient({
  chain: bsc,
  transport: http(undefined, { timeout: 8_000 }),
});

export type VerifyResult = { ok: true } | { ok: false; error: string };

export async function verifyAgentTransaction(
  txHash: string,
  creator: string
): Promise<VerifyResult> {
  if (!REGISTRY_ADDRESS) {
    return { ok: false, error: "registry_not_configured" };
  }
  if (!isHash(txHash) || !isAddress(creator)) {
    return { ok: false, error: "invalid_format" };
  }

  try {
    const [tx, receipt] = await Promise.all([
      publicClient.getTransaction({ hash: txHash as `0x${string}` }),
      publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` }),
    ]);

    if (tx.to?.toLowerCase() !== REGISTRY_ADDRESS.toLowerCase()) {
      return { ok: false, error: "wrong_recipient" };
    }
    if (tx.from.toLowerCase() !== creator.toLowerCase()) {
      return { ok: false, error: "wrong_sender" };
    }
    if (receipt.status !== "success") {
      return { ok: false, error: "transaction_failed" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "verification_failed" };
  }
}
