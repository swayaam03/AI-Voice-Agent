# Aura Skincare Voice AI Support Agent — Implementation Plan

## Overview
This document defines the sequential 16-phase implementation roadmap for developing the Aura Skincare voice support agent (**Aria**). Each phase adheres strictly to modular boundaries, incremental validation, and explicit anti-goals to prevent scope creep and maintain software quality.

---

## Phase Breakdown

### Phase 1: Project Foundation
- **Objective**: Establish the Next.js TypeScript project, configuration baseline, styling infrastructure, and folder structure.
- **Files Created / Modified**:
  - `package.json`, `tsconfig.json`, `next.config.mjs`
  - `tailwind.config.ts`, `postcss.config.mjs`, `src/app/globals.css`
  - `.env.example`, `.gitignore`
  - Core directory hierarchy (`src/app`, `src/components`, `src/lib`, `src/types`, `data`, `docs`)
- **Functionality Existing After Phase**: Clean compilation of Next.js App Router project with Tailwind CSS utilities and base design tokens.
- **How to Test**: Run `npm run build` and `npm run dev` to verify clean builds without lint or type errors.
- **What Should NOT Be Implemented Yet**: No UI components, no audio hooks, no API routes, no voice models.

---

### Phase 2: Frontend UI Shell & State Skeleton
- **Objective**: Build the static evaluator interface with Aura Skincare branding, agent state visualizer, call controls, transcript placeholder, and quick order helper card.
- **Files Created / Modified**:
  - `src/app/layout.tsx`, `src/app/page.tsx`
  - `src/components/ui/Header.tsx`, `src/components/ui/StatusBadge.tsx`
  - `src/components/voice/AgentCard.tsx`, `src/components/voice/VoiceController.tsx`
  - `src/components/orders/TestOrdersHelper.tsx`
  - `src/components/transcript/LiveTranscript.tsx`
  - `src/types/agent.ts` (Agent state enum: `IDLE`, `CONNECTING`, `LISTENING`, `THINKING`, `SPEAKING`, `ERROR`, `ENDED`)
- **Functionality Existing After Phase**: Beautiful, responsive evaluator dashboard with state cycling demonstration (buttons can simulate state transitions visually).
- **How to Test**: Visual inspection across viewport widths; verify click interactions on buttons and order helper copying/expansion.
- **What Should NOT Be Implemented Yet**: No real audio streaming, no WebRTC connections, no backend API calls.

---

### Phase 3: Mock Order Database
- **Objective**: Create the typed, local mock order database representing Aura Skincare orders and edge-case scenarios.
- **Files Created / Modified**:
  - `data/orders.json`
  - `src/types/order.ts` (Order entity definitions and OrderStatus types)
  - `src/lib/validation/order.schema.ts` (Zod schemas for order validation)
- **Functionality Existing After Phase**: Fully validated JSON mock data containing ORD-101 (Out for Delivery), ORD-102 (Delivered 14 days ago), and ORD-103 (Processing, 3 hours ago).
- **How to Test**: Unit test/script that validates `data/orders.json` against `OrderSchema`.
- **What Should NOT Be Implemented Yet**: No network APIs, no HTTP servers, no mutations or external databases.

---

### Phase 4: Order Service & Query Layer
- **Objective**: Implement the server-safe, deterministic order retrieval service with error handling for malformed or missing order IDs.
- **Files Created / Modified**:
  - `src/lib/orders/orderService.ts`
  - `src/app/api/orders/[id]/route.ts` (Optional dev inspection endpoint)
  - `src/lib/orders/orderService.test.ts`
- **Functionality Existing After Phase**: Functions `getOrderById(orderId: string)` returning structured results (`found: true` with order, or `found: false` with code `ORDER_NOT_FOUND` or `INVALID_FORMAT`).
- **How to Test**: Run automated unit tests verifying ORD-101, ORD-102, ORD-103, ORD-999 (not found), and invalid inputs ("101", null, empty string).
- **What Should NOT Be Implemented Yet**: No policy calculations inside the data layer; no voice integrations.

---

### Phase 5: Realtime Voice Connection (WebRTC Layer)
- **Objective**: Implement the browser WebRTC client and server-side ephemeral token minting to connect securely to the voice engine.
- **Files Created / Modified**:
  - `src/app/api/session/route.ts` (Secure server endpoint requesting ephemeral token with system prompt & tool definitions)
  - `src/lib/voice/webrtcClient.ts` (WebRTC peer connection, media track handler, data channel)
  - `src/hooks/useVoiceSession.ts` (React state orchestration hook)
  - `src/components/voice/VoiceController.tsx` (Hooked to live connect/disconnect)
- **Functionality Existing After Phase**: Evaluator clicks "Start Call", browser asks for mic permission, WebRTC peer connection completes, and two-way audio streaming is active.
- **How to Test**: Click "Start Call"; verify microphone captures sound and audio playback loop operates with sub-second latency.
- **What Should NOT Be Implemented Yet**: No complex business policies; tools are not yet wired to data layer.

---

### Phase 6: Aria Agent Persona & Conversational Tuning
- **Objective**: Craft and enforce Aria's system prompt: tone, brand identity, Indian customer support nuance, concise spoken voice output constraints, and scope boundaries.
- **Files Created / Modified**:
  - `src/lib/agent/prompts.ts` (System instructions, conversation principles, tone guidelines)
  - `src/lib/agent/brandKnowledge.ts` (Static Aura Skincare brand FAQs, ingredient philosophies, product lines)
  - `src/app/api/session/route.ts` (Inject updated prompt into session config)
- **Functionality Existing After Phase**: Aria introduces herself warmly, answers general brand questions, speaks concisely, and politely declines out-of-scope queries (e.g. flight bookings).
- **How to Test**: Voice queries: "Who are you?", "What is Aura Skincare?", "Can you book me a flight to Goa?".
- **What Should NOT Be Implemented Yet**: Order lookup tools are not yet executed.

---

### Phase 7: Tool / Function Calling Integration
- **Objective**: Expose `get_order_details` to the Realtime Voice session and wire client-side/server-side data channel tool calls.
- **Files Created / Modified**:
  - `src/lib/agent/tools.ts` (JSON Schema declaration for `get_order_details`)
  - `src/lib/agent/toolDispatcher.ts` (Router taking function call events, executing order service, returning output)
  - `src/hooks/useVoiceSession.ts` (Listening for `response.function_call_arguments.done` and sending `conversation.item.create` with tool output)
- **Functionality Existing After Phase**: When evaluator asks "Where is my order ORD-101?", Aria triggers the function call, receives order JSON, and speaks order status.
- **How to Test**: Query ORD-101, ORD-102, ORD-103 and ORD-999 via voice; verify tool execution in developer console.
- **What Should NOT Be Implemented Yet**: Deterministic policy decisions are not yet automated (handled in Phase 8).

---

### Phase 8: Deterministic Policy Engine
- **Objective**: Implement pure TypeScript business logic enforcing Aura Skincare policies (cancellation, returns, shipping, COD) and feed the exact verdict directly into the tool response.
- **Files Created / Modified**:
  - `src/lib/policies/cancellationPolicy.ts`
  - `src/lib/policies/returnPolicy.ts`
  - `src/lib/policies/shippingPolicy.ts`
  - `src/lib/policies/codPolicy.ts`
  - `src/lib/policies/index.ts`
  - `src/lib/agent/toolDispatcher.ts` (Integrate policy calculations into tool return payload)
  - `tests/policies.test.ts`
- **Functionality Existing After Phase**: Policy decisions are computed 100% in code. Aria speaks the computed policy decision and cannot be persuaded by the user to override it.
- **How to Test**:
  - Voice test: "Can I cancel ORD-101?" -> Result: Out for delivery, cannot cancel, may refuse at doorstep.
  - Voice test: "Can I cancel ORD-103?" -> Result: Processing, cancellation permitted.
  - Voice test: "Can I return ORD-102?" -> Result: Delivered 14 days ago, exceeds 7-day window.
- **What Should NOT Be Implemented Yet**: Post-call summary is not yet generated.

---

### Phase 9: Live Transcript Stream
- **Objective**: Parse real-time speech-to-text and text-to-speech transcription deltas from the WebRTC data channel and display a synchronized transcript in the UI.
- **Files Created / Modified**:
  - `src/hooks/useTranscript.ts`
  - `src/components/transcript/LiveTranscript.tsx`
  - `src/components/transcript/TranscriptItem.tsx`
- **Functionality Existing After Phase**: Real-time message bubbles appear for both user and Aria turns, auto-scrolling with timestamp and speaker identification.
- **How to Test**: Speak to Aria; observe immediate transcript streaming and confirmation of completed turns.
- **What Should NOT Be Implemented Yet**: Post-call AI extraction of summary.

---

### Phase 10: Post-Call Structured Summary
- **Objective**: Implement automatic generation and Zod validation of structured call summaries when the call ends.
- **Files Created / Modified**:
  - `src/lib/validation/summary.schema.ts` (Zod schema for structured summary)
  - `src/app/api/summary/route.ts` (Server route invoking OpenAI structured output)
  - `src/hooks/useCallSummary.ts`
  - `src/components/summary/PostCallModal.tsx`
- **Functionality Existing After Phase**: When evaluator clicks "End Call", a modal displays the structured summary (`customer_intent`, `order_id`, `resolution_status`, `call_summary`, `policy_decision`), with raw JSON copy capability.
- **How to Test**: Conduct call about ORD-101, hang up; verify that the summary accurately reflects the call details and matches the Zod schema.
- **What Should NOT Be Implemented Yet**: Edge case error injectors.

---

### Phase 11: Graceful Error Handling & Fallbacks
- **Objective**: Implement protective boundaries for all failure modes (mic denial, network drops, model timeouts, invalid order IDs, summary failures).
- **Files Created / Modified**:
  - `src/lib/utils/errorHandling.ts`
  - `src/components/ui/ErrorBanner.tsx`
  - Updates across `useVoiceSession.ts` and `route.ts` files
- **Functionality Existing After Phase**: Clear, non-technical UI guidance for microphone errors, audio fallback messaging, and deterministic fallback summaries if generation fails.
- **How to Test**: Deny microphone permissions in browser settings; simulate bad network or invalid order inputs.
- **What Should NOT Be Implemented Yet**: No destructive retries or unhandled exceptions.

---

### Phase 12: Interruption & Barge-In Experience
- **Objective**: Configure natural conversation flow allowing the evaluator to interrupt Aria mid-sentence, instantly stopping playback.
- **Files Created / Modified**:
  - `src/lib/voice/webrtcClient.ts` (Handle `input_audio_buffer.speech_started` and cancel pending audio buffer)
  - `src/hooks/useVoiceSession.ts`
- **Functionality Existing After Phase**: If the evaluator speaks while Aria is speaking, Aria immediately stops audio output and listens attentively.
- **How to Test**: While Aria is explaining a policy, speak "Wait, let me ask something else" and verify that playback cuts off instantly.
- **What Should NOT Be Implemented Yet**: Complex sentiment models or non-standard audio protocols.

---

### Phase 13: UI Polish & Aesthetics
- **Objective**: Refine visual design to deliver an understated, premium, responsive aesthetic fitting an organic skincare brand.
- **Files Created / Modified**:
  - `src/app/globals.css`
  - `src/components/voice/AudioWaveform.tsx`
  - Component styling across `src/components/`
- **Functionality Existing After Phase**: Smooth state transitions, organic muted color palette (botanical greens, warm neutrals, soft stone), accessible contrast ratios, and responsive mobile/desktop layouts.
- **How to Test**: Visual audit on Chrome, Safari, Edge, and mobile viewports.
- **What Should NOT Be Implemented Yet**: Heavy 3D libraries, flashy canvas particles, or intrusive animations.

---

### Phase 14: Comprehensive Verification & Testing
- **Objective**: Validate all 20 scenarios defined in the testing matrix.
- **Files Created / Modified**:
  - `tests/policies.test.ts`
  - `tests/orderService.test.ts`
  - `tests/summarySchema.test.ts`
  - `docs/test-execution-log.md`
- **Functionality Existing After Phase**: 100% automated test pass rate for policy engine, order service, and schema validators; manual voice test checklist verified.
- **How to Test**: Run `npm test` and execute the 20-scenario manual test walkthrough.
- **What Should NOT Be Implemented Yet**: Deployment to external clouds before code sign-off.

---

### Phase 15: Deployment & Environment Configuration
- **Objective**: Deploy the verified application to Vercel with zero client credential exposure and optimal edge caching.
- **Files Created / Modified**:
  - `vercel.json` (if custom headers needed)
  - Deployment configuration in project documentation
- **Functionality Existing After Phase**: Live production URL accessible by evaluators with HTTPS WebRTC support.
- **How to Test**: Open deployment URL on an external machine, initiate voice call, test order query and post-call summary.
- **What Should NOT Be Implemented Yet**: Public multi-tenant databases.

---

### Phase 16: README & Evaluator Demo Preparation
- **Objective**: Provide a concise, professional README with quickstart instructions, sample test scripts, evaluator walkthroughs, and architecture highlights.
- **Files Created / Modified**:
  - `README.md`
  - `docs/evaluator-guide.md`
- **Functionality Existing After Phase**: A complete repository ready for evaluator assessment, including exact voice phrases to test each business policy.
- **How to Test**: Clone to a clean directory, follow the README setup instructions, and verify initial call succeeds in under 3 minutes.
- **What Should NOT Be Implemented Yet**: None (final deliverable phase).
