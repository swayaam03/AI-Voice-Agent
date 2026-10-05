'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { AgentState, TranscriptMessage, CallSummary as CallSummaryType } from '@/types';
import { Header } from '@/components/ui/Header';
import { AgentCard } from '@/components/voice/AgentCard';
import { CallControls } from '@/components/voice/CallControls';
import { Transcript } from '@/components/transcript/Transcript';
import { OrderHelper } from '@/components/orders/OrderHelper';
import { CallSummary } from '@/components/summary/CallSummary';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import {
  MOCK_ORDERS,
  MOCK_TRANSCRIPT_CONVERSATION,
  MOCK_CALL_SUMMARY,
} from '@/lib/mockData';

export default function SupportDashboard() {
  // Primary call & agent state
  const [agentState, setAgentState] = useState<AgentState>('IDLE');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [summary, setSummary] = useState<CallSummaryType | null>(null);
  const [toolCallCount, setToolCallCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timer reference for call duration
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mockSequenceRef = useRef<NodeJS.Timeout[]>([]);

  // Clear all mock timeouts on unmount or reset
  const clearMockTimeouts = () => {
    mockSequenceRef.current.forEach(clearTimeout);
    mockSequenceRef.current = [];
  };

  // Duration timer effect
  useEffect(() => {
    const isCallActive =
      agentState === 'CONNECTING' ||
      agentState === 'LISTENING' ||
      agentState === 'THINKING' ||
      agentState === 'SPEAKING';

    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [agentState]);

  // Clean up mock timeouts on unmount
  useEffect(() => {
    return () => {
      clearMockTimeouts();
    };
  }, []);

  /**
   * Deterministic UI-only mock call progression
   * Demonstrates UI state transitions: IDLE -> CONNECTING -> LISTENING -> THINKING -> SPEAKING -> LISTENING
   */
  const handleStartCall = () => {
    clearMockTimeouts();
    setErrorMessage(null);
    setSummary(null);
    setMessages([]);
    setDurationSeconds(0);
    setToolCallCount(0);

    // Step 1: Connecting
    setAgentState('CONNECTING');

    // Step 2: Connection established, agent is listening
    const t1 = setTimeout(() => {
      setAgentState('LISTENING');

      // Add customer turn
      const t2 = setTimeout(() => {
        setMessages([MOCK_TRANSCRIPT_CONVERSATION[0]]);
        setAgentState('THINKING');

        // Agent thinking -> tool call
        const t3 = setTimeout(() => {
          setAgentState('SPEAKING');
          setToolCallCount(1);
          setMessages([
            MOCK_TRANSCRIPT_CONVERSATION[0],
            MOCK_TRANSCRIPT_CONVERSATION[1],
            MOCK_TRANSCRIPT_CONVERSATION[2],
          ]);

          // Return to listening for next turn
          const t4 = setTimeout(() => {
            setAgentState('LISTENING');
            // Complete remaining conversation turns
            const t5 = setTimeout(() => {
              setMessages(MOCK_TRANSCRIPT_CONVERSATION);
            }, 1200);
            mockSequenceRef.current.push(t5);
          }, 3500);
          mockSequenceRef.current.push(t4);
        }, 1500);
        mockSequenceRef.current.push(t3);
      }, 1200);
      mockSequenceRef.current.push(t2);
    }, 1200);
    mockSequenceRef.current.push(t1);
  };

  /**
   * End Call handler: transitions to ENDED, halts timers, reveals summary
   */
  const handleEndCall = () => {
    clearMockTimeouts();
    setAgentState('ENDED');
    // Ensure all transcript messages are populated for review
    setMessages(MOCK_TRANSCRIPT_CONVERSATION);
    setToolCallCount(1);
    // Populate structured call summary
    setSummary(MOCK_CALL_SUMMARY);
  };

  /**
   * Reset the demo back to initial IDLE state
   */
  const handleReset = () => {
    clearMockTimeouts();
    setAgentState('IDLE');
    setDurationSeconds(0);
    setMessages([]);
    setSummary(null);
    setToolCallCount(0);
    setErrorMessage(null);
  };

  /**
   * Evaluator testing tool: toggle mock error state
   */
  const handleTriggerError = () => {
    clearMockTimeouts();
    if (agentState === 'ERROR') {
      handleReset();
    } else {
      setAgentState('ERROR');
      setErrorMessage("Could not establish WebRTC audio connection to voice server.");
    }
  };

  const isCallActive =
    agentState === 'CONNECTING' ||
    agentState === 'LISTENING' ||
    agentState === 'THINKING' ||
    agentState === 'SPEAKING';

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#222521] flex flex-col font-sans">
      {/* Brand Header */}
      <Header />

      {/* Main Evaluator Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Error Alert Banner (if error triggered) */}
        {agentState === 'ERROR' && (
          <ErrorBanner
            title="Connection Error"
            message={errorMessage || "We couldn't connect to the voice service. Please check your network and microphone permissions."}
            onRetry={handleReset}
          />
        )}

        {/* Top Split: Agent Controls (Left) & Live Conversation (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Aria Card & Call Controls */}
          <div className="lg:col-span-5 space-y-4">
            <AgentCard
              state={agentState}
              durationSeconds={durationSeconds}
            />

            <div className="rounded-2xl border border-stone-200/90 bg-white p-4 shadow-xs">
              <CallControls
                state={agentState}
                onStartCall={handleStartCall}
                onEndCall={handleEndCall}
                onReset={handleReset}
                onTriggerError={handleTriggerError}
              />
            </div>
          </div>

          {/* Right Column: Live Transcript Panel */}
          <div className="lg:col-span-7">
            <Transcript
              messages={messages}
              isCallActive={isCallActive}
            />
          </div>
        </div>

        {/* Bottom Split: Test Orders Helper & Call Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Test Orders Helper (7 cols) */}
          <div className="lg:col-span-7">
            <OrderHelper orders={MOCK_ORDERS} />
          </div>

          {/* Post-Call Summary & Call Telemetry (5 cols) */}
          <div className="lg:col-span-5">
            <CallSummary
              summary={summary}
              agentState={agentState}
              durationSeconds={durationSeconds}
              messageCount={messages.length}
              toolCallCount={toolCallCount}
            />
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-stone-200/60 py-4 text-center text-xs text-stone-400 bg-white/50">
        <p>Aura Skincare AI Voice Support • Phase 2 Evaluator UI Shell</p>
      </footer>
    </div>
  );
}
