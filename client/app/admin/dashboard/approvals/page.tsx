import type { Metadata } from "next";
import { AdminApprovalsContainer } from "@/containers/admin-dashboard/approvals/admin-approvals-container";

export const metadata: Metadata = { title: "Approvals | Admin" };

export default function AdminApprovalsPage() {
  return <AdminApprovalsContainer />;
}
