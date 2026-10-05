# Aura Skincare Voice AI Support Agent — Technical Decisions & Architecture Rationale

## 1. Technology Choices & Justification

### 1.1 Web Voice Protocol: OpenAI Realtime WebRTC vs. WebSocket Relay vs. Pipeline (STT -> LLM -> TTS)

| Dimension | Browser WebRTC (Chosen) | WebSocket Server Relay | Pipeline (Whisper + Chat + TTS) |
| :--- | :--- | :--- | :--- |
| **End-to-End Latency** | **300ms – 600ms** (Natural speech cadence) | 800ms – 1,400ms | 1,500ms – 3,500ms (High friction) |
| **Interruption (Barge-in)** | **Native** (Browser echo cancellation + Realtime buffer cutoff) | Manual audio packet dropping required | Difficult; requires complex orchestration |
| **Architecture Complexity** | **Low** (Next.js server mints ephemeral token; browser negotiates direct peer connection) | High (Server must proxy continuous raw audio streams) | Very High (3 disjoint network hops, state drift risk) |
| **Credential Security** | **100% Secure** (Server mints short-lived ephemeral session token) | Secure | Secure |
| **Suitability for Assessment** | **Ideal**: Reliable, responsive, direct, deterministic tool integration | Medium | Low (Too slow for natural voice support) |

**Decision**: We use **OpenAI Realtime API over WebRTC** with an ephemeral session token minted by a Next.js server route (`/api/session`). The client browser establishes a direct peer connection with the Realtime Gateway. This yields sub-second latency, native acoustic echo cancellation, clean turn detection, and instant barge-in support.

---

### 1.2 Policy Enforcement Architecture: Code-First Determinism vs. LLM Prompt Guardrails

- **The Problem with LLM-Only Enforcement**: Relying on system prompts for business policies (e.g. *"Only cancel if processing"*) invites hallucination, prompt injection, and probabilistic drift. In customer support, overriding a cancellation policy costs real logistics dollars.
- **The Code-First Solution**:
  1. The LLM acts purely as a voice-to-intent interface.
  2. When the user asks to cancel an order, the LLM executes `get_order_details`.
  3. The application logic executes deterministic pure TypeScript functions (`src/lib/policies/`).
  4. The tool returns the exact policy verdict (`can_cancel: false`, `reason: "Order is out for delivery with BlueDart"`, `customer_action: "You may refuse delivery at the doorstep."`).
  5. The LLM is strictly instructed to speak the returned verdict and has no authority to alter it.

---

### 1.3 Schema Validation: Zod

- Used for validating order structures (`OrderSchema`), tool call inputs (`GetOrderDetailsInputSchema`), and post-call structured summaries (`PostCallSummarySchema`).
- Provides TypeScript type inference from runtime schemas, ensuring zero mismatch between API contracts, policy inputs, and UI consumers.

---

### 1.4 Mock Database: Local Typed JSON vs. SQLite / In-Memory DB

- **Decision**: Typed local JSON file (`data/orders.json`) wrapped in an in-memory service layer (`src/lib/orders/orderService.ts`).
- **Rationale**: For this assessment, introducing SQLite, Prisma, or Postgres adds operational overhead, migrations, and local native binary dependencies without enhancing the core evaluation criteria. A typed JSON file with an encapsulated service layer satisfies deterministic retrieval, handles invalid IDs cleanly, and can be swapped for a real API in production without touching agent or policy code.

---

## 2. Directory Structure & Rationale

```
├── data/
│   └── orders.json               # Canonical mock database for orders ORD-101, ORD-102, ORD-103
│
├── docs/
│   ├── architecture.md           # System architecture, component models, and data flows
│   ├── implementation-plan.md    # 16-phase development plan
│   ├── testing-strategy.md       # Test matrix & automated test specifications
│   └── technical-decisions.md    # Technology choices, security, observability, and rationale
│
├── src/
│   ├── app/                      # Next.js App Router root
│   │   ├── api/
│   │   │   ├── session/          # Mints ephemeral tokens for Realtime WebRTC
│   │   │   ├── summary/          # Post-call structured summary generation route
│   │   │   └── orders/           # Optional dev inspection endpoint for orders
│   │   ├── globals.css           # Brand CSS, Tailwind directives, glassmorphic tokens
│   │   ├── layout.tsx            # Global brand layout, fonts, and meta tags
│   │   └── page.tsx              # Evaluator main application view
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable atomic UI (Header, StatusBadge, Button, ErrorBanner)
│   │   ├── voice/                # Voice controls, Agent avatar card, animated waveform
│   │   ├── transcript/           # Live transcript container and chronological turn bubbles
│   │   ├── orders/               # Evaluator helper drawer with clickable test orders
│   │   ├── summary/              # Post-call modal with validated summary fields & JSON viewer
│   │   └── dev/                  # Developer Observability Drawer (WebRTC telemetry, tool inspector)
│   │
│   ├── hooks/
│   │   ├── useVoiceSession.ts    # WebRTC lifecycle, state transitions, audio stream binding
│   │   ├── useTranscript.ts      # Realtime transcript stream accumulator
│   │   └── useCallSummary.ts     # Post-call summary trigger and polling hook
│   │
│   ├── lib/
│   │   ├── agent/                # System prompts, Aria persona, tool schema definitions
│   │   ├── orders/               # Order retrieval service, ID normalizer
│   │   ├── policies/             # Pure deterministic business rules (cancellation, returns, etc.)
│   │   ├── validation/           # Zod schemas for orders, tools, and summaries
│   │   └── voice/                # WebRTC peer connection manager and data channel listeners
│   │
│   └── types/                    # Shared TypeScript interfaces (AgentState, Order, Tool, Policy)
│
└── tests/                        # Vitest automated test suite for policies, orders, and schemas
```

### Why Every Major Directory Exists:
- `data/`: Decouples business fixtures from application source code.
- `src/lib/policies/`: Pure business rules isolated from React, Next.js, and AI SDKs. 100% testable in isolation.
- `src/lib/orders/`: Isolates data access logic so that switching to a real Shopify or ERP endpoint requires changing only this module.
- `src/lib/agent/`: Centralizes prompts, brand knowledge, and tool schemas so AI behavior can be audited in one place.
- `src/components/dev/`: Keeps evaluator debugging tools cleanly isolated from the end-user customer support experience.

---

## 3. Security & Boundary Architecture

### 3.1 Credential Management
- **Zero Client-Side API Keys**: The permanent `OPENAI_API_KEY` is stored strictly in server environment variables (`.env.local` / Vercel Environment Variables).
- **Ephemeral Session Tokens**: The browser client calls `POST /api/session`. The Next.js server uses the permanent API key to request a short-lived ephemeral client session token from OpenAI. The ephemeral token is returned to the client and expires after the session completes. Even if an evaluator inspects the browser network tab, no permanent secret is exposed.

### 3.2 Input Sanitization & Tool Guardrails
- Order IDs passed to tools are sanitized (trimmed, uppercased, regex-checked against `/^ORD-\d{3}$/`).
- Tool calls are wrapped in defensive `try/catch` blocks. The system never exposes database stack traces to the agent.
- Out-of-scope customer prompts are handled at the prompt level with firm guardrails preventing Aria from assuming other personas or executing unapproved external commands.

---

## 4. Observability & Developer Telemetry

During assessment reviews, evaluators need to verify that tool calling, state transitions, and policy enforcement are genuinely executing in real-time.

A collapsible **Developer Observability Drawer** is provided at the bottom of the screen:
1. **WebRTC Stream Health**:
   - Connection State: `new` -> `connecting` -> `connected`
   - Audio input track status and output playback status
2. **State Machine Timeline**:
   - Current state pill: `IDLE` | `CONNECTING` | `LISTENING` | `THINKING` | `SPEAKING` | `ERROR` | `ENDED`
3. **Tool Invocation Inspector**:
   - Displays real-time JSON payloads: `tool_name`, `arguments`, `execution_time_ms`, `policy_verdict`.
4. **Console Log Stream**:
   - WebRTC data channel events formatted with timestamps.

This drawer is collapsed by default to maintain the clean aesthetic, but can be expanded with one click.

---

## 5. Graceful Degradation & Failure Handling Matrix

| Failure Mode | Detection Mechanism | Immediate Fallback Action | Evaluator / User Experience |
| :--- | :--- | :--- | :--- |
| **Microphone Permission Denied** | `getUserMedia` throws `NotAllowedError` | Transition to `ERROR` state; prevent WebRTC initiation | Display helpful instruction banner explaining how to allow mic permissions in browser settings. |
| **No Microphone Detected** | `getUserMedia` throws `NotFoundError` | Transition to `ERROR` state | Display notification asking user to plug in an audio input device. |
| **WebRTC ICE / Network Disconnect** | `peerConnection.onconnectionstatechange` === `failed` | Terminate pending audio; attempt clean teardown | Show "Connection interrupted" alert with a single-click "Reconnect" button. |
| **Invalid Order ID** | Tool router finds no match for ID | Return structured `found: false` response | Aria politely explains: *"I couldn't find an order with that ID in our system. Could you please double-check the order number?"* |
| **Missing Order ID** | Realtime agent detects intent without entity | Agent halts tool call; prompts user | Aria responds: *"I'd be happy to check that for you. Could you please provide your Order ID, such as ORD-101?"* |
| **Unclear Speech / Noise** | Silence or low-confidence transcription | Model triggers clarification turn | Aria responds: *"I'm sorry, I didn't quite catch that. Could you please repeat that?"* |
| **Post-Call Summary API Failure** | `/api/summary` encounters 500 or timeout | Return fallback summary constructed from raw turns | UI displays: *"Summary generation timed out; your full chronological transcript is preserved below."* |

---

## 6. Future Scalability Considerations

While outside the immediate scope of this assessment, the architecture is intentionally prepared for real-world scaling:

1. **Headless Commerce Transition**:
   - The `orderService.ts` interface (`getOrderById`) is async and isolated. Replacing the mock database with Shopify Storefront API, BigCommerce, or Saleor requires changing only the internal implementation of `orderService.ts`.
2. **Omnichannel & Telephony Bridge**:
   - The Realtime Session protocol and deterministic policy engine are decoupled from the browser. The exact same policy engine and tool dispatcher can be bound to a Twilio / SIP telephony gateway or LiveKit Cloud server.
3. **Dynamic Catalog Expansion via Vector Search**:
   - If Aura Skincare expands to hundreds of SKUs, an additional tool `search_product_catalog(query)` can be introduced to query a vector index for ingredient details, while keeping order and policy logic strictly deterministic.
