import { database } from "../database.ts";
import type { CartLine } from "../shared/calculateTotal.ts";
import { StripeClient, type StripePayload } from "../payments/internal/StripeClient.ts";
import { normalizePaymentStatus } from "../payments/normalizePaymentStatus.ts";

export class OrderService {
  private readonly stripe: StripeClient;

  constructor(stripe = new StripeClient()) {
    this.stripe = stripe;
  }

  async placeOrder(orderId: string, lines: CartLine[], total: number, payload: StripePayload) {
    for (const line of lines) {
      const row = database.stock.get(line.productId);
      if (!row || row.available < line.quantity) {
        throw new Error(`Insufficient stock for ${line.productId}`);
      }

      database.stock.set(line.productId, {
        productId: line.productId,
        available: row.available - line.quantity,
      });
    }

    database.orders.set(orderId, { id: orderId, status: "created", total });
    const providerResponse = await this.stripe.createCharge(payload);
    const paymentStatus = normalizePaymentStatus(providerResponse.state);
    const order = database.orders.get(orderId)!;
    order.paymentStatus = paymentStatus;
    order.status =
      paymentStatus === "paid"
        ? "confirmed"
        : paymentStatus === "processing"
          ? "processing"
          : "payment_pending";
    return { ...order };
  }
}