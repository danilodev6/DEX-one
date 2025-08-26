import type { Address } from "viem";

// These will be populated after deployment
export const CONTRACT_ADDRESSES = {
  DEX: "0x..." as Address,
  TOKEN_A: "0x..." as Address,
  TOKEN_B: "0x..." as Address,
  LP_TOKEN: "0x..." as Address,
} as const;

// Contract ABIs (copy from your compiled contracts)
export const DEX_ABI = [
  // Your SimpleDEX ABI here
] as const;

export const ERC20_ABI = [
  // Standard ERC20 ABI here
] as const;
