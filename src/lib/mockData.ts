import type { Order, TranscriptMessage, CallSummary } from '@/types';

/**
 * Assessment Test Orders matching the exact specifications:
 * ORD-101: Out for Delivery (BlueDart)
 * ORD-102: Delivered 14 days ago (Delhivery)
 * ORD-103: Processing, eligible for cancellation
 */
export const MOCK_ORDERS: Order[] = [
  {
    order_id: 'ORD-101',
    customer_name: 'Priya Sharma',
    items: [
      {
        name: 'Vitamin C Serum (30ml)',
        quantity: 1,
        price: 699,
      },
    ],
    total_value: 699,
    status: 'Out for Delivery',
    carrier: 'BlueDart',
    tracking_id: 'BD-982103',
    expected_delivery: 'Expected by 6 PM today',
  },
  {
    order_id: 'ORD-102',
    customer_name: 'Rahul Verma',
    items: [
      {
        name: 'Hydrating Sunscreen SPF 50',
        quantity: 1,
        price: 499,
      },
    ],
    total_value: 499,
    status: 'Delivered',
    carrier: 'Delhivery',
    tracking_id: 'DL-441029',
    delivered_date: 'Delivered 14 days ago',
    days_since_delivery: 14,
  },
  {
    order_id: 'ORD-103',
    customer_name: 'Ananya Patel',
    items: [
      {
        name: 'Green Tea Face Wash + Toner',
        quantity: 1,
        price: 850,
      },
    ],
    total_value: 850,
    status: 'Processing',
    created_at: 'Ordered 3 hours ago',
    cancellation_eligible: true,
  },
];

/**
 * Demonstration conversation showcasing the UI turns and layout.
 * Will be replaced with real WebRTC data channel events in later phases.
 */
export const MOCK_TRANSCRIPT_CONVERSATION: TranscriptMessage[] = [
  {
    id: 'mock-1',
    timestamp: Date.now() - 32000,
    speaker: 'user',
    text: 'Hi, where is my order ORD-101?',
    isFinal: true,
  },
  {
    id: 'mock-2',
    timestamp: Date.now() - 24000,
    speaker: 'agent',
    text: "Hello! Certainly, I can look that up for you right away. Let me check your order details.",
    isFinal: true,
    toolInvocation: {
      name: 'get_order_details',
      args: { order_id: 'ORD-101' },
      timestamp: Date.now() - 22000,
    },
  },
  {
    id: 'mock-3',
    timestamp: Date.now() - 15000,
    speaker: 'agent',
    text: "I found your order for the Vitamin C Serum. It's currently Out for Delivery with BlueDart and is expected to arrive by 6 PM today.",
    isFinal: true,
  },
  {
    id: 'mock-4',
    timestamp: Date.now() - 8000,
    speaker: 'user',
    text: 'Can I cancel it if I am not home?',
    isFinal: true,
  },
  {
    id: 'mock-5',
    timestamp: Date.now() - 2000,
    speaker: 'agent',
    text: "Since ORD-101 is already out for delivery, our cancellation policy doesn't allow cancellations at this stage. However, you can simply refuse delivery at your doorstep when BlueDart arrives.",
    isFinal: true,
  },
];

/**
 * Structured post-call summary demonstration data.
 */
export const MOCK_CALL_SUMMARY: CallSummary = {
  customer_intent: 'ORDER_TRACKING',
  order_id: 'ORD-101',
  resolution_status: 'RESOLVED',
  call_summary:
    'Customer inquired about the status and cancellation eligibility of ORD-101. The order is out for delivery with BlueDart and expected by 6 PM today. Aria communicated the deterministic policy: cancellations are not permitted for out-for-delivery orders, but doorstep refusal is allowed.',
  policy_decision: 'Cancellation disallowed (Status: Out for Delivery). Doorstep refusal option communicated.',
  actions_taken: [
    'Looked up order ORD-101 in database',
    'Retrieved BlueDart tracking details',
    'Enforced deterministic cancellation policy',
  ],
};
