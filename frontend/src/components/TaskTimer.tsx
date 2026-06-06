"use client";

import { useEffect, useState, useCallback } from "react";

interface TimerIconProps {
  size?: number;
  className?: string;
}

const PlayIcon = ({ size = 16, className = "" }: TimerIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
  </svg>
);

const StopIcon = ({ size = 16, className = "" }: TimerIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" />
  </svg>
);

const ClockIcon = ({ size = 14, className = "" }: TimerIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

interface TaskTimerProps {
  taskId: number;
  startedAt?: string | null;
  finishedAt?: string | null;
  duration?: string | null;
  onStart: (id: number) => Promise<void>;
  onStop: (id: number) => Promise<void>;
  isStarting?: boolean;
  isStopping?: boolean;
}

function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + Math.floor(parts[2]);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

function formatSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TaskTimer({
  taskId,
  startedAt,
  finishedAt,
  duration,
  onStart,
  onStop,
  isStarting = false,
  isStopping = false,
}: TaskTimerProps) {
  // تایمر در حال اجراست اگر started_at داشته باشه ولی finished_at نداشته باشه
  const isRunning = !!startedAt && !finishedAt;

  const getLiveSeconds = useCallback(() => {
    if (!isRunning || !startedAt) return null;
    return Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
  }, [isRunning, startedAt]);

  // initialize from getter and avoid calling setState synchronously inside effects
  const [liveSeconds, setLiveSeconds] = useState<number | null>(() => getLiveSeconds());

  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    // When not running, clear live seconds — defer to avoid synchronous setState in effect
    if (!isRunning) {
      const t = setTimeout(() => {
        if (mounted) setLiveSeconds(null);
      }, 0);
      return () => {
        mounted = false;
        clearTimeout(t);
      };
    }

    // When starting, defer the immediate set and then start interval updates
    const tStart = setTimeout(() => {
      if (mounted) setLiveSeconds(getLiveSeconds());
    }, 0);

    const interval = setInterval(() => {
      if (mounted) setLiveSeconds(getLiveSeconds());
    }, 1000);

    return () => {
      mounted = false;
      clearTimeout(tStart);
      clearInterval(interval);
    };
  }, [isRunning, getLiveSeconds]);

  const handleStart = async () => {
    setActionError(null);
    try {
      await onStart(taskId);
    } catch (err) {
      console.error("Timer start error:", err);
      setActionError("Failed to start timer");
    }
  };

  const handleStop = async () => {
    setActionError(null);
    try {
      await onStop(taskId);
    } catch (err) {
      console.error("Timer stop error:", err);
      setActionError("Failed to stop timer");
    }
  };

  const displayDuration = duration ? parseDurationToSeconds(duration) : null;
  const isBusy = isStarting || isStopping;

  return (
    <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between gap-2">
        {/* زمان */}
        <div className="flex items-center gap-1.5 text-sm min-w-0">
          <ClockIcon
            size={14}
            className={isRunning ? "text-emerald-500 shrink-0" : "text-zinc-400 dark:text-zinc-500 shrink-0"}
          />
          <span className="text-zinc-500 dark:text-zinc-400 shrink-0 text-xs font-medium">Time:</span>

          {isRunning && liveSeconds !== null ? (
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatSeconds(liveSeconds)}
            </span>
          ) : displayDuration !== null ? (
            <span className="font-mono text-zinc-700 dark:text-zinc-300 tabular-nums">
              {formatSeconds(displayDuration)}
            </span>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-500 italic text-xs">not started</span>
          )}

          {isRunning && (
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 animate-pulse shrink-0">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              LIVE
            </span>
          )}
        </div>

        {/* دکمه */}
        {isRunning ? (
          <button
            onClick={handleStop}
            disabled={isBusy}
            title="Stop timer"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium
              bg-red-100 text-red-700 hover:bg-red-200
              dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50
              transition disabled:opacity-50 shrink-0"
          >
            {isStopping ? (
              <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <StopIcon size={12} />
            )}
            {isStopping ? "…" : "Stop"}
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={isBusy}
            title="Start timer"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium
              bg-emerald-100 text-emerald-700 hover:bg-emerald-200
              dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50
              transition disabled:opacity-50 shrink-0"
          >
            {isStarting ? (
              <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlayIcon size={12} />
            )}
            {isStarting ? "…" : displayDuration !== null ? "Restart" : "Start"}
          </button>
        )}
      </div>

      {/* خطا */}
      {actionError && (
        <p className="mt-1.5 text-[11px] text-red-500 dark:text-red-400">{actionError}</p>
      )}

      {/* session info */}
      {(startedAt || finishedAt) && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-400 dark:text-zinc-500">
          {startedAt && (
            <span>Started: <span className="text-zinc-500 dark:text-zinc-400">{new Date(startedAt).toLocaleString()}</span></span>
          )}
          {finishedAt && (
            <span>Ended: <span className="text-zinc-500 dark:text-zinc-400">{new Date(finishedAt).toLocaleString()}</span></span>
          )}
        </div>
      )}
    </div>
  );
}
