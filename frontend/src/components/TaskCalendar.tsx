"use client";

import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import type { EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/calendar.css"; // lightweight overrides and responsive tweaks

export type CalendarTask = {
  id: number;
  title: string;
  due_date?: string | null; // ISO date string or date-only
  listName?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | string;
};

interface Props {
  tasks: CalendarTask[];
  className?: string;
  onTaskClick?: (task: CalendarTask) => void;
}

/**
 * TaskCalendar - wrapped FullCalendar month view optimized as a right-column widget.
 */
export default function TaskCalendar({ tasks, className = "", onTaskClick }: Props) {
  const events = useMemo(
    () =>
      tasks
        .filter((t) => t.due_date)
        .map((t) => {
          const dateOnly = new Date(t.due_date as string);
          const y = dateOnly.getFullYear();
          const m = String(dateOnly.getMonth() + 1).padStart(2, "0");
          const d = String(dateOnly.getDate()).padStart(2, "0");
          const start = `${y}-${m}-${d}`;
          const bg = t.priority === "HIGH" ? "#ef4444" : t.priority === "MEDIUM" ? "#f59e0b" : "#10b981";
          return {
            id: String(t.id),
            title: t.title,
            start,
            allDay: true,
            extendedProps: { raw: t },
            backgroundColor: bg,
            borderColor: bg,
            textColor: "#06202A",
          };
        }),
    [tasks]
  );

  const eventContent = (arg: EventContentArg) => {
    const raw: CalendarTask | undefined = (arg.event.extendedProps as { raw?: CalendarTask })?.raw;
    const subtitle = raw?.listName ?? "";

    return (
      <div className="fc-custom-event" title={arg.event.title} aria-label={arg.event.title}>
        <div className="fc-event-body">
          <div className="fc-event-title" aria-hidden>
            {arg.event.title}
          </div>
          {subtitle && <div className="fc-event-sub">{subtitle}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className={`task-calendar-widget ${className}`} role="region" aria-label="Due tasks calendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        buttonText={{ today: "Today" }}
        height="auto"
        contentHeight="auto"
        aspectRatio={1.25}
        dayMaxEventRows={3}
        weekNumbers={false}
        fixedWeekCount={false}
        events={events}
        eventContent={eventContent}
        eventClick={(info) => {
          const raw = (info.event.extendedProps as { raw?: CalendarTask })?.raw;
          if (raw && onTaskClick) onTaskClick(raw);
        }}
        eventDidMount={(info) => {
          // make event nodes keyboard-focusable and accessible
          const el = info.el as HTMLElement;
          el.setAttribute("role", "button");
          el.tabIndex = 0;
        }}
        dayCellClassNames={(arg) => {
          const key = arg.date.toISOString().slice(0, 10);
          const has = tasks.some((t) => t.due_date && t.due_date.slice(0, 10) === key);
          return has ? ["has-task"] : [];
        }}
      />
    </div>
  );
}