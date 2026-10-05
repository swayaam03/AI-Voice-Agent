import React from 'react';
import type { TranscriptMessage as TranscriptMessageType } from '@/types';
import { User, Sparkles, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TranscriptMessageProps {
  message: TranscriptMessageType;
}

export function TranscriptMessage({ message }: TranscriptMessageProps) {
  const isUser = message.speaker === 'user';
  const isAgent = message.speaker === 'agent';

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div
      className={cn(
        'flex gap-3 py-3 transition-opacity',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Speaker Avatar Icon */}
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold shadow-2xs',
          isUser
            ? 'bg-stone-200 text-stone-700'
            : isAgent
            ? 'bg-aura-800 text-white'
            : 'bg-stone-100 text-stone-500'
        )}
        aria-hidden="true"
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Message Content Bubble */}
      <div
        className={cn(
          'flex max-w-[82%] flex-col',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-medium text-stone-900">
            {isUser ? 'Customer' : 'Aria'}
          </span>
          <span className="text-[10px] text-stone-400">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-2xs',
            isUser
              ? 'bg-aura-900 text-white rounded-tr-xs'
              : 'bg-white border border-stone-200/90 text-stone-800 rounded-tl-xs'
          )}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Optional tool call indicator (when agent called a tool like get_order_details) */}
        {message.toolInvocation && (
          <div className="mt-1.5 flex items-center gap-1.5 rounded-md bg-stone-100/90 px-2 py-1 text-[11px] font-mono text-stone-600 border border-stone-200/60">
            <Wrench className="h-3 w-3 text-aura-700" />
            <span className="font-semibold text-aura-900">
              {message.toolInvocation.name}
            </span>
            <span className="text-stone-400">
              ({JSON.stringify(message.toolInvocation.args)})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
