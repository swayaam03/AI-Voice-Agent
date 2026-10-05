import React, { useState } from 'react';
import type { CallSummary as CallSummaryType, AgentState } from '@/types';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { FileText, CheckCircle2, AlertCircle, Clock, ShieldCheck, Code, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CallSummaryProps {
  summary: CallSummaryType | null;
  agentState: AgentState;
  durationSeconds: number;
  messageCount: number;
  toolCallCount: number;
  className?: string;
}

export function CallSummary({
  summary,
  agentState,
  durationSeconds,
  messageCount,
  toolCallCount,
  className,
}: CallSummaryProps) {
  const [showJson, setShowJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const copyJson = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      setCopiedJson(false);
    }
  };

  const resolutionVariant = {
    RESOLVED: 'success' as const,
    UNRESOLVED: 'warning' as const,
    ESCALATED: 'warning' as const,
    INFO_ONLY: 'info' as const,
  }[summary?.resolution_status || 'INFO_ONLY'];

  return (
    <Card className={className}>
      <SectionHeader
        title="Call Information & Structured Summary"
        subtitle="Automatic extraction and deterministic policy verification"
        icon={<FileText className="h-4 w-4" />}
        action={
          summary && (
            <button
              type="button"
              onClick={() => setShowJson(!showJson)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <Code className="h-3.5 w-3.5" />
              <span>{showJson ? 'Card View' : 'Raw JSON'}</span>
            </button>
          )
        }
      />

      {/* Call Telemetry stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs">
        <div>
          <span className="text-stone-400 block font-normal text-[11px]">
            Call Status
          </span>
          <span className="font-semibold text-stone-800 uppercase tracking-wide">
            {agentState}
          </span>
        </div>
        <div>
          <span className="text-stone-400 block font-normal text-[11px]">
            Duration
          </span>
          <span className="font-mono font-semibold text-stone-800">
            {formatDuration(durationSeconds)}
          </span>
        </div>
        <div>
          <span className="text-stone-400 block font-normal text-[11px]">
            Messages
          </span>
          <span className="font-semibold text-stone-800 font-mono">
            {messageCount}
          </span>
        </div>
        <div>
          <span className="text-stone-400 block font-normal text-[11px]">
            Tool Calls
          </span>
          <span className="font-semibold text-aura-800 font-mono">
            {toolCallCount}
          </span>
        </div>
      </div>

      {/* Summary Content or Empty State */}
      {!summary ? (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-stone-200 bg-stone-50/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-400 mb-2.5">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-stone-700">
            Call Summary Pending
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm">
            Your structured call summary will automatically appear here once the conversation concludes.
          </p>
        </div>
      ) : showJson ? (
        <div className="relative rounded-xl bg-stone-900 p-4 text-xs font-mono text-stone-100 overflow-x-auto">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-stone-800 text-[11px] text-stone-400">
            <span>JSON Output</span>
            <button
              type="button"
              onClick={copyJson}
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              {copiedJson ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Code className="h-3 w-3" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
          <pre>{JSON.stringify(summary, null, 2)}</pre>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Top key fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-stone-100 bg-[#faf9f6] p-3">
              <span className="text-[11px] text-stone-400 block uppercase tracking-wider font-semibold">
                Customer Intent
              </span>
              <span className="font-mono text-xs font-bold text-stone-900 mt-0.5 block">
                {summary.customer_intent}
              </span>
            </div>

            <div className="rounded-xl border border-stone-100 bg-[#faf9f6] p-3">
              <span className="text-[11px] text-stone-400 block uppercase tracking-wider font-semibold">
                Order ID
              </span>
              <span className="font-mono text-xs font-bold text-stone-900 mt-0.5 block">
                {summary.order_id || 'N/A'}
              </span>
            </div>

            <div className="rounded-xl border border-stone-100 bg-[#faf9f6] p-3">
              <span className="text-[11px] text-stone-400 block uppercase tracking-wider font-semibold">
                Resolution
              </span>
              <div className="mt-0.5">
                <Badge variant={resolutionVariant} size="sm">
                  {summary.resolution_status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Narrative Summary */}
          <div className="rounded-xl border border-stone-200/80 bg-white p-3.5">
            <span className="text-xs font-semibold text-stone-900 block mb-1">
              Call Narrative
            </span>
            <p className="text-xs text-stone-600 leading-relaxed">
              {summary.call_summary}
            </p>
          </div>

          {/* Policy Decision Box */}
          {summary.policy_decision && (
            <div className="rounded-xl border border-aura-200/80 bg-aura-50/60 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-aura-900 mb-1">
                <ShieldCheck className="h-4 w-4 text-aura-700" />
                <span>Deterministic Policy Decision</span>
              </div>
              <p className="text-xs text-aura-800 leading-relaxed font-mono">
                {summary.policy_decision}
              </p>
            </div>
          )}

          {/* Actions Taken */}
          {summary.actions_taken && summary.actions_taken.length > 0 && (
            <div className="rounded-xl border border-stone-100 bg-[#faf9f6] p-3">
              <span className="text-xs font-semibold text-stone-800 block mb-1.5">
                Actions Taken
              </span>
              <ul className="space-y-1 text-xs text-stone-600">
                {summary.actions_taken.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-aura-700 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
