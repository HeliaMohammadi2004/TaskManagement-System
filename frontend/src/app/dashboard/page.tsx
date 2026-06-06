"use client";

import { useEffect, useMemo, useState } from "react";
import TaskCalendar, { CalendarTask } from "@/components/TaskCalendar";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import WorkspaceCard from "@/components/WorkspaceCard";
import { WorkspaceSkeleton } from "@/components/WorkspaceSkeleton";
import EmptyState from "@/components/EmptyState";
import CreateWorkspaceForm from "@/components/CreateWorkspaceForm";
import { Workspace } from "@/types/api";
import { api } from "@/lib/axios";

export default function DashboardPage() {
  const { data, isLoading, remove } = useWorkspaces();
  const [mobileCalOpen, setMobileCalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  type RawTask = {
    id?: number | string;
    title?: string;
    name?: string;
    due_date?: string | Date | null;
    listName?: string;
    list?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | string;
    [key: string]: unknown;
  };

  const [rawTasks, setRawTasks] = useState<RawTask[]>([]);

  useEffect(() => {
    let mounted = true;
    api
      .get("/tasks/")
      .then((res) => {
        if (!mounted) return;
        setRawTasks(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const calendarTasks: CalendarTask[] = useMemo(
    () =>
      rawTasks
        .filter((t) => t?.due_date)
        .map((t) => ({
          id: Number(t.id ?? 0),
          title: t.title ?? t.name ?? "Untitled",
          due_date: t.due_date ? new Date(t.due_date).toISOString() : undefined,
          priority: (t.priority as CalendarTask["priority"]) ?? "MEDIUM",
        })),
    [rawTasks]
  );

  const MAX_UPCOMING = 7;
  const upcomingTasks = useMemo(() => {
    return calendarTasks
      .map((t) => ({
        ...t,
        dueTs: t.due_date ? Date.parse(t.due_date) : Infinity,
      }))
      .sort((a, b) => (a.dueTs ?? Infinity) - (b.dueTs ?? Infinity))
      .slice(0, MAX_UPCOMING);
  }, [calendarTasks]);

  const formatDateShort = (iso?: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const [now] = useState<number>(() => Date.now());

  const handleDelete = async (id: number) => {
    if (confirm("Delete workspace permanently?")) {
      await remove.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <WorkspaceSkeleton />
        <WorkspaceSkeleton />
        <WorkspaceSkeleton />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div>
        <CreateWorkspaceForm />
        <EmptyState
          title="No workspaces yet"
          description="Create your first workspace to start organizing tasks."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* دو ستون: محتوای اصلی + تقویم در سمت راست (فقط دسکتاپ) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        {/* ستون چپ - محتوای اصلی (بدون فاصله اضافی در راست) */}
        <div className="flex flex-col gap-6">
          {/* کارت Dashboard */}
          <div className="rounded-lg border border-theme bg-[color:var(--card)] p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-sm text-muted mt-1">
                  Overview of your tasks and workspaces.
                </p>

                {/* لیست تسک‌های نزدیک */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-800">Due soon</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">
                        {calendarTasks.length} total
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {loading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse rounded-md bg-slate-100 h-12" />
                        ))}
                      </div>
                    ) : upcomingTasks.length === 0 ? (
                      <div className="text-sm text-slate-500">No upcoming due tasks.</div>
                    ) : (
                      <>
                        <div className="grid gap-2 max-h-72 overflow-auto pr-2">
                          {upcomingTasks.map((t) => {
                            const dueTs = t.due_date ? Date.parse(t.due_date) : NaN;
                            const daysFromNow = Number.isFinite(dueTs)
                              ? Math.round((dueTs - now) / 86400000)
                              : null;
                            const relativeLabel =
                              daysFromNow === null
                                ? ""
                                : daysFromNow === 0
                                ? "Today"
                                : daysFromNow === 1
                                ? "Tomorrow"
                                : daysFromNow > 1
                                ? `in ${daysFromNow}d`
                                : `${Math.abs(daysFromNow)}d ago`;

                            return (
                              <button
                                key={t.id}
                                onClick={() => console.log("open task", t)}
                                className="w-full flex items-center justify-between gap-3 rounded-md bg-white border border-theme px-3 py-2 hover:shadow-sm transition text-left"
                                title={t.title}
                              >
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-slate-900 truncate">
                                    {t.title}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col items-end">
                                    <div className="text-xs font-mono text-slate-700">
                                      {formatDateShort(t.due_date)}
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                      {relativeLabel}
                                    </div>
                                  </div>
                                  <span
                                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                      t.priority === "HIGH"
                                        ? "bg-red-100 text-red-800"
                                        : t.priority === "MEDIUM"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-emerald-100 text-emerald-800"
                                    }`}
                                  >
                                    {t.priority}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* دکمه باز کردن تقویم در موبایل */}
              <div className="sm:hidden">
                <button
                  onClick={() => setMobileCalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-[color:var(--accent)] px-3 py-2 text-sm font-medium text-white shadow-sm"
                >
                  Open calendar
                </button>
              </div>
            </div>

            {loading ? (
              <div className="mt-4 text-sm text-slate-500">Loading calendar data…</div>
            ) : calendarTasks.length === 0 ? (
              <div className="mt-4 text-sm text-slate-500">No tasks with due dates found.</div>
            ) : null}
          </div>

          {/* Priority */}
          <div className="rounded-md border border-theme bg-white p-3 text-sm">
            <div className="font-medium text-slate-800 mb-2">Priority</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444] block" />
                <span className="text-xs text-slate-600">High</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b] block" />
                <span className="text-xs text-slate-600">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] block" />
                <span className="text-xs text-slate-600">Low</span>
              </div>
            </div>
          </div>

          {/* بخش Workspaceها */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">My Workspaces</h1>
              <CreateWorkspaceForm />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((workspace: Workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ستون راست - تقویم (فقط دسکتاپ) */}
        <div className="hidden md:flex md:justify-end">
          <div className="w-full max-w-[520px] sticky top-6"> {/* match css max-width for clean fit */}
            <TaskCalendar
              tasks={calendarTasks}
              className="w-full"
              onTaskClick={(t) => {
                console.log("task clicked from calendar:", t);
              }}
            />
          </div>
        </div>
      </div>

      {/* مودال تقویم برای موبایل */}
      {mobileCalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileCalOpen(false)} />
          <div className="relative z-10 w-full max-w-md">
            <TaskCalendar
              tasks={calendarTasks}
              className="w-full bg-white rounded-lg p-3"
              onTaskClick={() => setMobileCalOpen(false)}
            />
            <button
              onClick={() => setMobileCalOpen(false)}
              className="mt-3 w-full rounded-md border border-theme bg-white py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}