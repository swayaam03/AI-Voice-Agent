import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'interactive';
}

export function Card({
  children,
  className,
  variant = 'default',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white border-stone-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]',
    muted: 'bg-[#faf9f6] border-stone-200/80 shadow-none',
    interactive:
      'bg-white border-stone-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-aura-300 hover:shadow-[0_2px_6px_rgba(0,0,0,0.05)] transition-all',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border p-5 transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
