"use client";

import { useState } from "react";
import { ReservationData, businessConfig } from "@/lib/config";

interface CalendarViewProps {
  reservations: ReservationData[];
  onDateSelect: (date: string) => void;
}

export default function CalendarView({
  reservations,
  onDateSelect,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  // Count reservations for a date
  const getReservationCount = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return reservations.filter(
      (r) => r.date === dateStr && r.status !== "キャンセル"
    ).length;
  };

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Render calendar
  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Day names header
    const dayNameRow = dayNames.map((name, i) => (
      <div
        key={name}
        className={`text-center text-xs font-medium py-2 ${
          i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-600"
        }`}
      >
        {name}
      </div>
    ));

    // Empty cells for days before first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const dateStr = date.toISOString().split("T")[0];
      const count = getReservationCount(date);
      const isToday = date.getTime() === today.getTime();
      const dayOfWeek = date.getDay();
      const isClosed = businessConfig.closedDayNumbers.includes(dayOfWeek);

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(dateStr)}
          className={`p-2 text-center rounded-lg transition-all min-h-[60px] flex flex-col items-center justify-start ${
            isToday
              ? "bg-pink-50 border-2 border-pink-500"
              : isClosed
              ? "bg-gray-50"
              : "hover:bg-gray-50"
          } ${
            dayOfWeek === 0
              ? "text-red-500"
              : dayOfWeek === 6
              ? "text-blue-500"
              : "text-gray-900"
          }`}
        >
          <span className={`text-sm ${isToday ? "font-bold" : ""}`}>{day}</span>
          {count > 0 && (
            <span
              className="mt-1 text-xs px-1.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: businessConfig.theme.primary }}
            >
              {count}件
            </span>
          )}
        </button>
      );
    }

    return (
      <>
        <div className="grid grid-cols-7">{dayNameRow}</div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="font-medium text-gray-900">
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
        </span>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {renderCalendar()}

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-gray-500 justify-center flex-wrap">
        <span className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: businessConfig.theme.primary }}
          />
          予約あり
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-200 rounded" />
          定休日
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-pink-500 rounded" />
          今日
        </span>
      </div>
    </div>
  );
}
