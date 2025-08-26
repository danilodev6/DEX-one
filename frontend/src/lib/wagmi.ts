import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "DEX Portfolio",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "fallback-project-id",
  chains: [hardhat],
  ssr: true,
});
