import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum, sepolia } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

export const projectId = import.meta.env.VITE_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: "cryptowallet",
  description: "wallet viewer app",
  url: "https://reown.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

export const networks = [mainnet, arbitrum, sepolia] as [
  AppKitNetwork,
  ...AppKitNetwork[]
];

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
