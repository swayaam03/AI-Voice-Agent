import React from 'react';
import { Phone, PhoneOff, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { AgentState } from '@/types';

export interface CallControlsProps {
  state: AgentState;
  onStartCall: () => void;
  onEndCall: () => void;
  onReset: () => void;
  onTriggerError?: () => void;
  className?: string;
}

export function CallControls({
  state,
  onStartCall,
  onEndCall,
  onReset,
  onTriggerError,
  className,
}: CallControlsProps) {
  const isCallActive =
    state === 'CONNECTING' ||
    state === 'LISTENING' ||
    state === 'THINKING' ||
    state === 'SPEAKING';

  const isEnded = state === 'ENDED';
  const isError = state === 'ERROR';

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Primary Start Call button */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onStartCall}
          disabled={isCallActive}
          aria-label="Start call with Aria"
          className="flex-1 shadow-sm"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          <span>{isEnded ? 'Start New Call' : 'Start Call'}</span>
        </Button>

        {/* End Call button */}
        <Button
          type="button"
          variant="danger"
          size="lg"
          onClick={onEndCall}
          disabled={!isCallActive}
          aria-label="End active call"
          className="flex-1"
        >
          <PhoneOff className="h-4 w-4" aria-hidden="true" />
          <span>End Call</span>
        </Button>
      </div>

      {/* Evaluator testing helpers: Quick Reset & Trigger Error */}
      <div className="mt-3 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
        <div className="flex items-center gap-2">
          {onTriggerError && (
            <button
              type="button"
              onClick={onTriggerError}
              className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 transition-colors p-1 rounded"
              title="Test UI Error State"
            >
              <AlertTriangle className="h-3 w-3 text-amber-600" />
              <span>{isError ? 'Clear Error' : 'Test Error State'}</span>
            </button>
          )}
        </div>

        {(isEnded || isError) && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 transition-colors p-1 rounded"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Demo</span>
          </button>
        )}
      </div>
    </div>
  );
}
