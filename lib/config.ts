export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || null;
export const FOUR_MEME_URL =
  process.env.NEXT_PUBLIC_FOUR_MEME_URL || "https://four.meme";
export const BSCSCAN_ADDRESS_BASE = "https://bscscan.com/address/";
export const BSCSCAN_TX_BASE = "https://bscscan.com/tx/";

// Wallet address that receives every agent-creation transaction. Each tx's
// calldata carries the agent definition, so this address's history is a
// public, onchain, append-only registry of every agent ever launched.
export const REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ||
  null) as `0x${string}` | null;

export const BSC_CHAIN_ID = 56;

// Renting an agent is a second small payment tx to the same registry address.
export const RENT_PRICE_BNB = "0.001";
export const RENT_DURATION_SECONDS = 60 * 60;
