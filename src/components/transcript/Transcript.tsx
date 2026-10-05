import React, { useEffect, useRef } from 'react';
import type { TranscriptMessage as TranscriptMessageType } from '@/types';
import { TranscriptMessage } from './TranscriptMessage';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MessageSquare, MessagesSquare } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface TranscriptProps {
  messages: TranscriptMessageType[];
  isCallActive: boolean;
  className?: string;
}

export function Transcript({ messages, isCallActive, className }: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className={className}>
      <SectionHeader
        title="Live Conversation"
        subtitle="Chronological real-time audio transcript"
        icon={<MessagesSquare className="h-4 w-4" />}
        action={
          <Badge variant="subtle" size="sm">
            {messages.length} {messages.length === 1 ? 'turn' : 'turns'}
          </Badge>
        }
      />

      <div
        ref={scrollRef}
        tabIndex={0}
        aria-label="Conversation message history"
        className="h-[380px] overflow-y-auto pr-1 space-y-1 rounded-xl bg-stone-50/50 p-3 border border-stone-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aura-400"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-6 text-stone-400">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 mb-3">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-stone-700">
              No conversation yet
            </p>
            <p className="text-xs text-stone-400 mt-1 max-w-xs">
              {isCallActive
                ? 'Speak through your microphone to begin talking with Aria.'
                : 'Click "Start Call" to begin speaking with Aria.'}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <TranscriptMessage key={message.id} message={message} />
          ))
        )}
      </div>
    </Card>
  );
}
