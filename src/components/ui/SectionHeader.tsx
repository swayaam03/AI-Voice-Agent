import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3 mb-4', className)}>
      <div className="flex items-center gap-2.5">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aura-100/70 text-aura-800">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-stone-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-stone-500 font-normal mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
