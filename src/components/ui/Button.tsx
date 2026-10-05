import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary:
        'bg-aura-800 text-white hover:bg-aura-900 active:bg-aura-950 shadow-sm border border-aura-900/10',
      secondary:
        'bg-aura-100 text-aura-900 hover:bg-aura-200 active:bg-aura-300 border border-aura-200',
      outline:
        'bg-white text-stone-800 border border-stone-200 hover:bg-stone-50 active:bg-stone-100 shadow-xs',
      danger:
        'bg-rose-50 text-rose-700 hover:bg-rose-100 active:bg-rose-200 border border-rose-200',
      ghost:
        'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 border-transparent',
    };

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 font-medium rounded-lg gap-1.5',
      md: 'text-sm px-4 py-2 font-medium rounded-xl gap-2',
      lg: 'text-base px-5 py-2.5 font-medium rounded-xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-700 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
