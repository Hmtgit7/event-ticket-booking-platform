/**
 * Shapes returned by / sent to payment-service's /payments endpoints. Field
 * names match CreateOrderRequest.java / CreateOrderResponse.java exactly.
 */

export interface CreateOrderRequest {
  amount: number;
}

export interface CreateOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  razorpayKeyId: string;
}
