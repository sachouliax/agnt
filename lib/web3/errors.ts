import { BaseError, UserRejectedRequestError } from "viem";

// Surfaces the real wallet/RPC error instead of a blanket "rejected" message,
// so failures like insufficient funds or a chain mismatch are distinguishable
// from the user actually clicking "Reject" in their wallet.
export function describeSendError(err: unknown, rejectedMessage: string, genericMessage: string) {
  console.error("AGNT transaction failed:", err);

  if (err instanceof BaseError) {
    const rejection = err.walk((e) => e instanceof UserRejectedRequestError);
    if (rejection) return rejectedMessage;
    return err.shortMessage || err.message || genericMessage;
  }
  if (err instanceof Error) {
    return err.message || genericMessage;
  }
  return genericMessage;
}
