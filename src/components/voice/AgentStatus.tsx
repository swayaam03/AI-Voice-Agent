import React from 'react';
import type { AgentState } from '@/types';
import { cn } from '@/lib/utils';

export interface AgentStatusProps {
  state: AgentState;
  className?: string;
}

const STATE_CONFIG: Record<
  AgentState,
  {
    label: string;
    description: string;
    dotColor: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    shouldPulse: boolean;
  }
> = {
  IDLE: {
    label: 'Ready',
    description: 'Waiting to start call...',
    dotColor: 'bg-stone-400',
    bgColor: 'bg-stone-100',
    textColor: 'text-stone-700',
    borderColor: 'border-stone-200',
    shouldPulse: false,
  },
  CONNECTING: {
    label: 'Connecting',
    description: 'Setting up realtime voice...',
    dotColor: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    shouldPulse: true,
  },
  LISTENING: {
    label: 'Listening',
    description: 'Aria is listening to you...',
    dotColor: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    shouldPulse: true,
  },
  THINKING: {
    label: 'Thinking',
    description: 'Aria is preparing a response...',
    dotColor: 'bg-sky-500',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-800',
    borderColor: 'border-sky-200',
    shouldPulse: true,
  },
  SPEAKING: {
    label: 'Speaking',
    description: 'Aria is speaking...',
    dotColor: 'bg-aura-600',
    bgColor: 'bg-aura-100',
    textColor: 'text-aura-900',
    borderColor: 'border-aura-300',
    shouldPulse: true,
  },
  ERROR: {
    label: 'Error',
    description: 'Voice connection issue occurred',
    dotColor: 'bg-rose-500',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-800',
    borderColor: 'border-rose-200',
    shouldPulse: false,
  },
  ENDED: {
    label: 'Call Ended',
    description: 'Summary generated below',
    dotColor: 'bg-stone-400',
    bgColor: 'bg-stone-100',
    textColor: 'text-stone-700',
    borderColor: 'border-stone-200',
    shouldPulse: false,
  },
};

export function AgentStatus({ state, className }: AgentStatusProps) {
  const config = STATE_CONFIG[state] || STATE_CONFIG.IDLE;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 transition-all',
        config.bgColor,
        config.borderColor,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {config.shouldPulse && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping',
              config.dotColor
            )}
            aria-hidden="true"
          />
        )}
        <span
          className={cn('relative inline-flex h-2 w-2 rounded-full', config.dotColor)}
          aria-hidden="true"
        />
      </span>
      <span className={cn('text-xs font-medium uppercase tracking-wider', config.textColor)}>
        {config.label}
      </span>
      <span className="text-stone-300" aria-hidden="true">
        •
      </span>
      <span className="text-xs text-stone-600 font-normal">
        {config.description}
      </span>
    </div>
  );
}
