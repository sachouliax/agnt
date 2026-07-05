import { createPublicClient, http, isAddress, isHash } from "viem";
import { bsc } from "viem/chains";
import { REGISTRY_ADDRESS } from "@/lib/config";

const publicClient = createPublicClient({
  chain: bsc,
  transport: http(undefined, { timeout: 8_000 }),
});

export type VerifyResult = { ok: true } | { ok: false; error: string };

async function verifyRegistryTransaction(
  txHash: string,
  sender: string,
  minValueWei?: bigint
): Promise<VerifyResult> {
  if (!REGISTRY_ADDRESS) {
    return { ok: false, error: "registry_not_configured" };
  }
  if (!isHash(txHash) || !isAddress(sender)) {
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
    if (tx.from.toLowerCase() !== sender.toLowerCase()) {
      return { ok: false, error: "wrong_sender" };
    }
    if (receipt.status !== "success") {
      return { ok: false, error: "transaction_failed" };
    }
    if (minValueWei !== undefined && tx.value < minValueWei) {
      return { ok: false, error: "insufficient_value" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "verification_failed" };
  }
}

export function verifyAgentTransaction(txHash: string, creator: string) {
  return verifyRegistryTransaction(txHash, creator);
}

export function verifyRentTransaction(txHash: string, renter: string, minValueWei: bigint) {
  return verifyRegistryTransaction(txHash, renter, minValueWei);
}
