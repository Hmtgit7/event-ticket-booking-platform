"use client";

import { useCallback, useRef } from "react";

/**
 * Minimal wrapper around Razorpay's Checkout.js - loads the script once
 * (cached on window), then opens the widget. Deliberately does NOT trust
 * the client-side "handler" callback as proof of payment: that only means
 * the user completed the Checkout flow, not that Razorpay actually
 * captured the payment. The wallet only gets credited once payment-service's
 * webhook confirms capture and publishes payment.completed over Kafka - see
 * RechargeWalletModal's polling after checkout succeeds.
 */

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
}

const CHECKOUT_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckoutScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();

  const existing = document.querySelector(`script[src="${CHECKOUT_SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay checkout script")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout script"));
    document.body.appendChild(script);
  });
}

export function useRazorpayCheckout() {
  const openingRef = useRef(false);

  const open = useCallback(
    async (params: {
      razorpayKeyId: string;
      razorpayOrderId: string;
      amount: number;
      currency: string;
      onSuccess: (paymentId: string) => void;
      onDismiss: () => void;
      onError: (message: string) => void;
    }) => {
      if (openingRef.current) return;
      openingRef.current = true;

      try {
        await loadCheckoutScript();
        if (!window.Razorpay) {
          params.onError("Payment gateway failed to load. Please try again.");
          return;
        }

        const razorpay = new window.Razorpay({
          key: params.razorpayKeyId,
          // Razorpay wants the amount in paise, matching what payment-service sent it as when creating the order.
          amount: Math.round(params.amount * 100),
          currency: params.currency,
          order_id: params.razorpayOrderId,
          name: "GrabMyTicket",
          description: "Wallet recharge",
          handler: (response) => params.onSuccess(response.razorpay_payment_id),
          modal: { ondismiss: params.onDismiss },
          theme: { color: "#f43f5e" },
        });
        razorpay.open();
      } catch {
        params.onError("Payment gateway failed to load. Please try again.");
      } finally {
        openingRef.current = false;
      }
    },
    [],
  );

  return { open };
}
