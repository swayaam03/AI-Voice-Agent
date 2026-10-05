export type TranscriptSpeaker = 'user' | 'agent' | 'system';

export interface ToolInvocationRecord {
  name: string;
  args: Record<string, unknown>;
  result?: Record<string, unknown>;
  timestamp: number;
}

export interface TranscriptMessage {
  id: string;
  timestamp: number;
  speaker: TranscriptSpeaker;
  text: string;
  isFinal: boolean;
  toolInvocation?: ToolInvocationRecord;
}
