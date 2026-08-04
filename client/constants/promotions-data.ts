export interface PromoCode {
  id: string;
  code: string;
  discount: string;
  type: "percent" | "fixed";
  usesLimit: number;
  usesCount: number;
  expiresAt: string;
  status: "Active" | "Expired" | "Paused";
  event: string;
}

export const DUMMY_PROMOS: PromoCode[] = [
  { id: "p-001", code: "EARLYBIRD20", discount: "20%", type: "percent", usesLimit: 100, usesCount: 43, expiresAt: "Nov 15, 2025", status: "Active",  event: "Food Exhibition" },
  { id: "p-002", code: "VIPFASHION",  discount: "$10", type: "fixed",   usesLimit: 50,  usesCount: 50, expiresAt: "Nov 20, 2025", status: "Expired", event: "Fashion Empire" },
  { id: "p-003", code: "TECHSAVE15",  discount: "15%", type: "percent", usesLimit: 200, usesCount: 88, expiresAt: "Dec 1, 2025",  status: "Active",  event: "AI Make us Better" },
  { id: "p-004", code: "CAMPFREE",    discount: "$5",  type: "fixed",   usesLimit: 30,  usesCount: 12, expiresAt: "Dec 5, 2025",  status: "Paused",  event: "How to Camp" },
  { id: "p-005", code: "NYE2025",     discount: "10%", type: "percent", usesLimit: 500, usesCount: 201,expiresAt: "Dec 31, 2025", status: "Active",  event: "Hip Hop Thugs" },
];
