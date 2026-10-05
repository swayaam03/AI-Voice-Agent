# Aura Skincare Voice AI Support Agent — Testing Strategy & Test Matrix

## 1. Testing Philosophy & Quality Standard

The primary objective of the testing strategy is to guarantee:
1. **Deterministic Business Policy Adherence**: The AI agent **never** approves an action that violates code-enforced rules (e.g. cancelling an "Out for Delivery" order or accepting a return after 14 days).
2. **Sub-Second Voice Latency & Conversational Fluidity**: Natural turn-taking, prompt response times, and immediate barge-in/interruption.
3. **Resilient Failure Handling**: Graceful degradation when inputs are unclear, mic access is denied, network connections drop, or order IDs are malformed.
4. **Structured Output Integrity**: Post-call summaries strictly conform to Zod schemas.

---

## 2. Testing Levels

| Test Level | Scope | Method | Tools |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | Policy engine pure functions, order service lookup, schema validators. | Automated execution | Vitest / Jest, Zod |
| **Integration Tests** | Ephemeral session token route, tool dispatcher payload synthesis, summary generation endpoint. | Automated API tests | Vitest / Next.js Test Suite |
| **End-to-End Voice Tests** | Full conversational scenarios, microphone input, audio playback, live transcript, and UI state transitions. | Evaluator audio walkthrough | Browser WebRTC, Developer Observability Drawer |

---

## 3. Comprehensive 20-Scenario Test Matrix

The following matrix covers all 20 required assessment scenarios:

| # | Scenario | Voice Input / Evaluator Action | Expected Tool Invocation | Deterministic Policy Evaluation | Expected Agent Response | Acceptance Criteria |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Greeting** | Connects call: "Hi" or silence upon connection. | None | N/A | Warm, professional Indian support greeting: introduces herself as Aria from Aura Skincare, asks how she can assist. | Natural, concise greeting in under 1.5 seconds. State is `SPEAKING` then `LISTENING`. |
| **2** | **Shipping Question** | "What are your shipping charges and delivery time?" | None (General Knowledge) | Shipping Policy: Orders >= ₹499 free; < ₹499 is ₹50; delivery takes 3–5 business days. | Aria explains: Free shipping on orders above ₹499, ₹50 fee below ₹499, standard delivery takes 3 to 5 business days. | Correct policy values stated concisely without hallucinating third-party couriers or express options. |
| **3** | **ORD-101 Lookup** | "Can you check the status of order ORD-101?" | `get_order_details({ order_id: "ORD-101" })` | Mock DB lookup: Status is "Out for Delivery", Carrier BlueDart, expected by 6 PM today. | Aria states: Order contains Vitamin C Serum (₹699), is out for delivery with BlueDart, and expected by 6 PM today. | Tool executed with exact ID; accurate status and carrier communicated. |
| **4** | **ORD-102 Lookup** | "Where is my order ORD-102?" | `get_order_details({ order_id: "ORD-102" })` | Mock DB lookup: Status is "Delivered", Delhivery, delivered 14 days ago. | Aria states: Order for Hydrating Sunscreen was delivered 14 days ago via Delhivery. | Tool executed; past delivery timeframe accurately communicated. |
| **5** | **ORD-103 Lookup** | "Tell me about order ORD-103." | `get_order_details({ order_id: "ORD-103" })` | Mock DB lookup: Status is "Processing", ordered 3 hours ago, value ₹850. | Aria states: Order for Green Tea Face Wash + Toner is currently in processing. | Accurate items and processing status conveyed. |
| **6** | **Invalid Order ID** | "Can you check order ORD-999?" | `get_order_details({ order_id: "ORD-999" })` | Service returns: `found: false`, code `ORDER_NOT_FOUND`. | Aria politely informs that ORD-999 could not be found in the system and asks to verify the number. | Model does NOT invent an order; gracefully prompts for a valid ID. |
| **7** | **Missing Order ID** | "I want to track my order." (No ID provided) | None (Agent prompts user first) | Parameter validation: `order_id` is required. | Aria asks customer for their Order ID (e.g. ORD-101). | Agent does not call tool with empty/undefined parameter; asks clarifying question. |
| **8** | **Cancel ORD-103** | "I want to cancel order ORD-103." | `get_order_details({ order_id: "ORD-103" })` | Policy engine: Status is "Processing" -> `can_cancel: true`. | Aria confirms: ORD-103 is in processing, so cancellation is eligible and can be processed. | Deterministic policy explicitly approves cancellation; agent confirms. |
| **9** | **Cancel ORD-101** | "Please cancel my order ORD-101." | `get_order_details({ order_id: "ORD-101" })` | Policy engine: Status is "Out for Delivery" -> `can_cancel: false`, doorstep refusal permitted. | Aria explains: ORD-101 is already out for delivery so it cannot be cancelled, but the customer may refuse delivery at the doorstep. | Deterministic policy rejects cancellation; model cannot override; mentions doorstep refusal. |
| **10** | **Return ORD-102** | "I want to return order ORD-102." | `get_order_details({ order_id: "ORD-102" })` | Policy engine: Delivered 14 days ago > 7-day limit -> `return_allowed: false`. | Aria explains: Aura Skincare's return window is 7 days from delivery. Since ORD-102 was delivered 14 days ago, it cannot be returned. | Policy correctly rejects return due to the expired 7-day window. |
| **11** | **COD Eligibility** | "Do you provide Cash on Delivery, and is it available for my order?" | None (or with order value check) | COD Policy: Available up to ₹2,500 via Cash or UPI at doorstep. | Aria states: COD is available for orders up to ₹2,500, payable via cash or UPI upon delivery. | Accurate limit (₹2,500) and payment methods mentioned. |
| **12** | **Out-of-Scope Request** | "Can you book me a flight to Goa?" | None | Scope Boundary Policy: Aura Skincare queries only. | Aria politely declines: explains she can only assist with Aura Skincare orders and product inquiries. | Graceful refusal; maintains professional persona; no hallucinated flight bookings. |
| **13** | **Unclear Speech** | Evaluator mumbles or makes unintelligible sounds. | None | Silence / Low confidence threshold. | Aria politely asks for clarification: "I'm sorry, I didn't quite catch that. Could you please repeat that?" | System does not crash or execute random tools; recovers gracefully. |
| **14** | **Microphone Denial** | Evaluator blocks microphone permission in browser. | None (Client-side trap) | Client WebRTC error trap `NotAllowedError`. | UI displays friendly error banner: "Microphone access is required to speak with Aria. Please enable permissions in your browser bar." | UI transitions to `ERROR` state; no uncaught exceptions; clear recovery prompt. |
| **15** | **Voice Connection Failure** | Simulated network offline or API token failure. | None (Session error) | WebRTC peer connection failure event. | UI displays error message with "Retry Connection" button. | State transitions to `ERROR`; app remains stable and allows clean retry. |
| **16** | **End Call** | Evaluator clicks "End Call" button or says "Goodbye, that's all." | Teardown sequence | WebRTC stream terminated; state `ENDED`. | Audio cuts cleanly; UI updates to show call has concluded. | Microphone tracks stopped; UI triggers transcript finalization and summary request. |
| **17** | **Transcript Generation** | Entire conversation turns. | Realtime stream parser | Realtime transcription events aggregated. | UI displays clean, chronological conversation transcript with user and Aria bubbles. | All spoken turns captured with accurate speaker tags and timestamps. |
| **18** | **Summary Generation** | Call completes normally. | `POST /api/summary` | Zod schema validation on structured output. | Post-call modal pops up showing: `customer_intent`, `order_id`, `resolution_status`, `call_summary`, `policy_decision`. | Summary matches Zod schema 100%; reflects the actual conversation accurately. |
| **19** | **Summary Failure** | Simulate summary LLM error or invalid JSON response. | `POST /api/summary` returns 500 or malformed JSON | Schema fallback validator. | UI displays graceful fallback summary with note: "Automated summary temporarily unavailable; raw transcript preserved." | Modal does not crash; evaluator can still view and copy full raw transcript. |
| **20** | **Agent Interruption (Barge-In)** | Evaluator speaks while Aria is speaking mid-sentence. | Client handles speech start event | WebRTC audio output muted immediately; incoming response cancelled. | Aria instantly stops speaking and listens to the evaluator's new statement. | Audio truncation latency < 250ms; no overlapping audio echo. |

---

## 4. Automated Test Specifications

### Unit Tests: Deterministic Policy Engine (`tests/policies.test.ts`)
```typescript
describe('Deterministic Policy Engine', () => {
  describe('Cancellation Policy', () => {
    it('allows cancellation for Processing status (ORD-103)', () => {
      const result = evaluateCancellationPolicy('Processing');
      expect(result.can_cancel).toBe(true);
      expect(result.customer_action).toMatch(/processed immediately/i);
    });

    it('rejects cancellation for Out for Delivery status (ORD-101) with doorstep refusal guidance', () => {
      const result = evaluateCancellationPolicy('Out for Delivery');
      expect(result.can_cancel).toBe(false);
      expect(result.customer_action).toMatch(/refuse delivery/i);
    });

    it('rejects cancellation for Shipped status with doorstep refusal guidance', () => {
      const result = evaluateCancellationPolicy('Shipped');
      expect(result.can_cancel).toBe(false);
      expect(result.customer_action).toMatch(/refuse delivery/i);
    });

    it('rejects cancellation for Delivered status (ORD-102)', () => {
      const result = evaluateCancellationPolicy('Delivered');
      expect(result.can_cancel).toBe(false);
    });
  });

  describe('Return Policy', () => {
    it('rejects return if delivered more than 7 days ago (ORD-102: 14 days)', () => {
      const result = evaluateReturnPolicy({ daysSinceDelivery: 14, isUnopened: true });
      expect(result.allowed).toBe(false);
      expect(result.reason).toMatch(/exceeds the 7-day return window/i);
    });

    it('allows return if delivered within 7 days and product is unopened', () => {
      const result = evaluateReturnPolicy({ daysSinceDelivery: 3, isUnopened: true });
      expect(result.allowed).toBe(true);
    });

    it('rejects return if product has been opened', () => {
      const result = evaluateReturnPolicy({ daysSinceDelivery: 2, isUnopened: false });
      expect(result.allowed).toBe(false);
      expect(result.reason).toMatch(/unopened and unused/i);
    });
  });

  describe('Shipping & COD Policies', () => {
    it('applies free shipping for orders >= ₹499', () => {
      expect(calculateShippingFee(499)).toBe(0);
      expect(calculateShippingFee(850)).toBe(0);
    });

    it('applies ₹50 shipping fee for orders < ₹499', () => {
      expect(calculateShippingFee(498)).toBe(50);
      expect(calculateShippingFee(250)).toBe(50);
    });

    it('approves COD for orders <= ₹2,500', () => {
      expect(evaluateCodEligibility(2500).eligible).toBe(true);
      expect(evaluateCodEligibility(850).eligible).toBe(true);
    });

    it('rejects COD for orders > ₹2,500', () => {
      expect(evaluateCodEligibility(2501).eligible).toBe(false);
    });
  });
});
```

---

## 5. Evaluator Walkthrough Audio Script

To verify all core assessment capabilities in under 3 minutes, evaluators can follow this quick sequence:

1. **Click "Start Call"**: Listen to Aria's initial greeting.
2. **Policy Query**: *"What is your return policy and shipping fee?"*
   - *Verify*: Aria explains the 7-day return policy and ₹499 free shipping threshold.
3. **Cancellation Rule Check**: *"Can I cancel order ORD-101?"*
   - *Verify*: Aria executes `get_order_details`, checks status ("Out for Delivery"), and firmly states it cannot be cancelled, but delivery can be refused at doorstep.
4. **Barge-in / Interruption Check**: While Aria explains doorstep refusal, interrupt: *"Wait, what about order ORD-103?"*
   - *Verify*: Aria cuts audio immediately, looks up ORD-103, and confirms it can be cancelled because it is in "Processing".
5. **Out of Scope Check**: *"Can you recommend a flight to Mumbai?"*
   - *Verify*: Aria politely declines and redirects back to Aura Skincare.
6. **Click "End Call"**:
   - *Verify*: Complete chronological transcript is visible and structured summary card displays validated JSON with `customer_intent: "ORDER_CANCELLATION"`.
