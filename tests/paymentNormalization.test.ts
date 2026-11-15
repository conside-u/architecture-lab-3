import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizePaymentStatus } from "../src/payments/normalizePaymentStatus.ts";
import { mapPaymentStatus as mapOrderStatus } from "../src/orders/mapPaymentStatus.ts";
import { mapPaymentStatus as mapNotificationStatus } from "../src/notifications/mapPaymentStatus.ts";
import { mapPaymentStatus as mapReportStatus } from "../src/reports/mapPaymentStatus.ts";

describe("Payment status normalization (Level 60)", () => {
  it("normalizes 'succeeded' to 'paid'", () => {
    assert.equal(normalizePaymentStatus("succeeded"), "paid");
    assert.equal(mapOrderStatus({ charge_id: "ch_1", state: "succeeded" }), "paid");
    assert.equal(mapNotificationStatus({ charge_id: "ch_1", state: "succeeded" }), "paid");
    assert.equal(mapReportStatus({ charge_id: "ch_1", state: "succeeded" }), "paid");
  });

  it("normalizes 'requires_action' and 'processing' to 'processing'", () => {
    assert.equal(normalizePaymentStatus("requires_action"), "processing");
    assert.equal(normalizePaymentStatus("processing"), "processing");
    assert.equal(mapOrderStatus({ charge_id: "ch_2", state: "requires_action" }), "processing");
  });

  it("normalizes 'declined' and 'failed' to 'failed'", () => {
    assert.equal(normalizePaymentStatus("declined"), "failed");
    assert.equal(normalizePaymentStatus("failed"), "failed");
    assert.equal(mapOrderStatus({ charge_id: "ch_3", state: "declined" }), "failed");
  });

  it("safely falls back to 'failed' for unknown provider statuses", () => {
    assert.equal(normalizePaymentStatus("unknown_provider_state"), "failed");
    assert.equal(normalizePaymentStatus(""), "failed");
  });
});