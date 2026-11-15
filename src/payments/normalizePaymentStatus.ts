export type NormalizedPaymentStatus = "paid" | "processing" | "failed";

export function normalizePaymentStatus(providerState: string): NormalizedPaymentStatus {
  if (providerState === "succeeded") {
    return "paid";
  }
  if (providerState === "requires_action" || providerState === "processing") {
    return "processing";
  }
  if (providerState === "declined" || providerState === "failed") {
    return "failed";
  }
  return "failed";
}