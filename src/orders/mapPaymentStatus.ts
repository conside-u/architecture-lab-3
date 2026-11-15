import type { StripeResponse } from "../payments/internal/StripeClient.ts";
import { normalizePaymentStatus, type NormalizedPaymentStatus } from "../payments/normalizePaymentStatus.ts";

export function mapPaymentStatus(response: StripeResponse): NormalizedPaymentStatus {
  return normalizePaymentStatus(response.state);
}