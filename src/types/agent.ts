/**
 * Real-time operational states of the AI Voice Agent
 */
export type AgentState =
  | 'IDLE'
  | 'CONNECTING'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'ERROR'
  | 'ENDED';

/**
 * Top-level voice call session state
 */
export type CallState = {
  status: AgentState;
  callId?: string;
  startedAt?: number;
  endedAt?: number;
  errorMessage?: string;
};
