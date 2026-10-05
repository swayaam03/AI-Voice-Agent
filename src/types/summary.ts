export type ResolutionStatus = 'RESOLVED' | 'UNRESOLVED' | 'ESCALATED' | 'INFO_ONLY';

export interface CallSummary {
  customer_intent: string;
  order_id?: string | null;
  resolution_status: ResolutionStatus;
  call_summary: string;
  policy_decision?: string | null;
  actions_taken?: string[];
}
