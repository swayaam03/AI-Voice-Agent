import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface ErrorBannerProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBanner({
  title = 'Something went wrong',
  message = "We couldn't connect to the voice service. Please check your network and microphone permissions.",
  onRetry,
  className,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-2xl border border-rose-200 bg-rose-50/80 p-4 transition-all',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-rose-900">{title}</h4>
            <p className="text-xs text-rose-700 mt-0.5">{message}</p>
          </div>
        </div>

        {onRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-rose-300 text-rose-800 hover:bg-rose-100 self-end sm:self-auto shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>
        )}
      </div>
    </div>
  );
}
