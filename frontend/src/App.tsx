import { createAppKit, useAppKitAccount } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  projectId,
  metadata,
  networks,
  wagmiAdapter,
} from "./config/index.tsx";
import "./App.css";
import { mainnet } from "viem/chains";
import { TransactionTable } from "./components/transactionTable/txTable.tsx";
import WalletAddress from "./components/walletAddress/walletAddress.tsx";
import { useState } from "react";
import { Transaction } from "./components/transactionTable/txTable.tsx";
import ManageTagsButton from "./components/manageTags/ManageTagsButton/manageTagsButton.tsx";

const queryClient = new QueryClient();

const generalConfig = {
  projectId,
  networks,
  metadata,
};

createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
  defaultNetwork: mainnet,
  features: {
    analytics: true,
  },
});

export function App() {
  const { address } = useAppKitAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  return (
    <div className={"pages"}>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <div className="app-bar">
            <h1>Wallet Viewer Web App</h1>
            <ManageTagsButton address={address || ""} />
          </div>
          {/* @ts-expect-error msg */}
          <appkit-button />
          <WalletAddress
            address={address || ""}
            setTransactions={setTransactions}
          />
          <TransactionTable transactions={transactions} />
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}

export default App;
