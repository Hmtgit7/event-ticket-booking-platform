import { paymentApiClient } from "@/lib/api-client";
import type { CreateOrderRequest, CreateOrderResponse } from "@/interfaces/payment-api.interface";

/** Thin wrapper over payment-service's /payments REST API. No business logic here - that lives in the components/hooks. */
export const paymentService = {
  createOrder: (payload: CreateOrderRequest) =>
    paymentApiClient.post<CreateOrderResponse>("/payments/orders", payload),
};
