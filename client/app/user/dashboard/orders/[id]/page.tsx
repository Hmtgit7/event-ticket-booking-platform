import { BookingDetailContainer } from "@/containers/user-dashboard/orders/booking-detail-container";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookingDetailContainer bookingId={id} />;
}
