import type { Metadata } from "next";
import { WalletContainer } from "@/containers/user-dashboard/wallet/wallet-container";

export const metadata: Metadata = { title: "Wallet" };

export default function UserWalletPage() {
  return <WalletContainer />;
}
