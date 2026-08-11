import type { Metadata } from "next";
import { OrdersContainer } from "@/containers/user-dashboard/orders/orders-container";

export const metadata: Metadata = { title: "Orders" };

export default function UserOrdersPage() {
  return <OrdersContainer />;
}
