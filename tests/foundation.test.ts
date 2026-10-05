import { describe, it, expect } from 'vitest';
import type { AgentState, Order, CallSummary } from '@/types';

describe('Project Foundation & Types', () => {
  it('validates AgentState type assignment', () => {
    const validState: AgentState = 'IDLE';
    expect(validState).toBe('IDLE');
  });

  it('validates Order type structure', () => {
    const sampleOrder: Order = {
      order_id: 'ORD-101',
      customer_name: 'Priya Sharma',
      items: [{ name: 'Vitamin C Serum (30ml)', quantity: 1, price: 699 }],
      total_value: 699,
      status: 'Out for Delivery',
    };
    expect(sampleOrder.order_id).toBe('ORD-101');
    expect(sampleOrder.status).toBe('Out for Delivery');
  });

  it('validates CallSummary type structure', () => {
    const summary: CallSummary = {
      customer_intent: 'ORDER_TRACKING',
      order_id: 'ORD-101',
      resolution_status: 'RESOLVED',
      call_summary: 'Customer checked delivery status.',
    };
    expect(summary.customer_intent).toBe('ORDER_TRACKING');
    expect(summary.resolution_status).toBe('RESOLVED');
  });
});
