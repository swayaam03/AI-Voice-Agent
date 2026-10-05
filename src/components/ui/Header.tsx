import React from 'react';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-aura-700 to-aura-900 text-white shadow-xs">
            <span className="text-sm font-semibold tracking-wider">A</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-stone-900">
                Aura Skincare
              </span>
              <span className="hidden sm:inline-block text-[11px] rounded-full bg-aura-100/80 px-2 py-0.5 font-medium text-aura-800 border border-aura-200/60">
                Organic Indian D2C
              </span>
            </div>
            <p className="text-xs text-stone-500 font-normal">
              AI Voice Customer Support Specialist
            </p>
          </div>
        </div>

        {/* System online badge and evaluator note */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-stone-100/90 px-2.5 py-1 text-xs text-stone-700 border border-stone-200/70">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="font-medium text-stone-700">System Online</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[11px] text-stone-400 font-mono">
            <Sparkles className="h-3 w-3 text-aura-600" />
            <span>Aria Agent v1.0</span>
          </div>
        </div>
      </div>
    </header>
  );
}
