import React from 'react';
import type { AgentState } from '@/types';
import { AgentStatus } from './AgentStatus';
import { Card } from '@/components/ui/Card';
import { Bot, Mic, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AgentCardProps {
  state: AgentState;
  durationSeconds: number;
  className?: string;
}

export function AgentCard({ state, durationSeconds, className }: AgentCardProps) {
  const isSpeaking = state === 'SPEAKING';
  const isListening = state === 'LISTENING';
  const isThinking = state === 'THINKING';
  const isCallActive = isSpeaking || isListening || isThinking;

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Card className={cn('relative overflow-hidden bg-white/95', className)}>
      {/* Subtle top botanical highlight bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 transition-colors duration-500',
          isSpeaking
            ? 'bg-aura-600'
            : isListening
            ? 'bg-emerald-500'
            : isThinking
            ? 'bg-sky-500'
            : 'bg-aura-200'
        )}
      />

      <div className="flex flex-col items-center text-center pt-2">
        {/* Abstract botanical avatar mark */}
        <div className="relative mb-4">
          <div
            className={cn(
              'flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 shadow-sm border',
              isSpeaking
                ? 'bg-aura-800 border-aura-700 text-white ring-4 ring-aura-100'
                : isListening
                ? 'bg-emerald-700 border-emerald-600 text-white ring-4 ring-emerald-50'
                : isThinking
                ? 'bg-sky-700 border-sky-600 text-white ring-4 ring-sky-50'
                : 'bg-stone-50 border-stone-200 text-aura-900'
            )}
          >
            {isListening ? (
              <Mic className="h-9 w-9 text-emerald-100 motion-safe:animate-pulse" />
            ) : isSpeaking ? (
              <Sparkles className="h-9 w-9 text-aura-100 motion-safe:animate-pulse" />
            ) : (
              <div className="flex flex-col items-center">
                <span className="font-serif text-2xl font-bold tracking-tight">A</span>
                <span className="text-[9px] uppercase tracking-widest font-mono opacity-80">Aria</span>
              </div>
            )}
          </div>

          {/* Online badge anchor */}
          <div
            className={cn(
              'absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-xs',
              isCallActive ? 'bg-emerald-500' : 'bg-stone-400'
            )}
            title={isCallActive ? 'Call active' : 'Agent idle'}
          >
            <Bot className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Persona identity */}
        <h1 className="text-xl font-semibold tracking-tight text-stone-900">
          Aria
        </h1>
        <p className="text-xs text-stone-500 font-normal mt-0.5">
          AI Customer Support Specialist • Aura Skincare
        </p>
        <p className="text-[11px] text-stone-400 mt-1 max-w-xs">
          Assisting with orders, returns, delivery updates, and skincare policies.
        </p>

        {/* Live state badge */}
        <div className="mt-5 w-full flex justify-center">
          <AgentStatus state={state} />
        </div>

        {/* Subtle audio waveform visualizer for active voice */}
        <div className="mt-5 flex items-center justify-center gap-1 h-6 w-full max-w-[160px]" aria-hidden="true">
          {[12, 24, 16, 32, 20, 28, 14, 22].map((height, idx) => (
            <span
              key={idx}
              className={cn(
                'w-1 rounded-full transition-all duration-300',
                isSpeaking
                  ? 'bg-aura-700'
                  : isListening
                  ? 'bg-emerald-600'
                  : 'bg-stone-200'
              )}
              style={{
                height: isSpeaking
                  ? `${Math.max(6, (height * (idx % 2 === 0 ? 1 : 0.7)))}px`
                  : isListening
                  ? `${Math.max(4, (height * 0.5))}px`
                  : '4px',
              }}
            />
          ))}
        </div>

        {/* Live Call Duration */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
          <span className="font-medium text-stone-400">Duration:</span>
          <span className="font-mono text-stone-700 font-semibold bg-stone-100 px-2 py-0.5 rounded">
            {formatDuration(durationSeconds)}
          </span>
        </div>
      </div>
    </Card>
  );
}
