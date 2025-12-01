"use client";

import { useState } from "react";
import { BusinessConfig } from "@/types";

interface CalendarProps {
  config: BusinessConfig;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function Calendar({
  config,
  selectedDate,
  onDateSelect,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { theme, closedDayNumbers } = config;

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return {
      daysInMonth: lastDay.getDate(),
      startingDay: firstDay.getDay(),
    };
  };

  // Check if date is available
  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;
    if (closedDayNumbers.includes(date.getDay())) return false;
    return true;
  };

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const canGoPrev = () => {
    const today = new Date();
    return (
      currentMonth.getFullYear() > today.getFullYear() ||
      (currentMonth.getFullYear() === today.getFullYear() &&
        currentMonth.getMonth() > today.getMonth())
    );
  };

  // Render calendar
  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

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

    // Empty cells
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split("T")[0];
      const available = isDateAvailable(date);
      const isSelected = selectedDate === dateStr;
      const dayOfWeek = date.getDay();

      days.push(
        <button
          key={day}
          onClick={() => available && onDateSelect(dateStr)}
          disabled={!available}
          className={`p-2 text-center rounded-lg transition-all min-h-[44px] ${
            isSelected
              ? "text-white font-bold"
              : available
              ? dayOfWeek === 0
                ? "text-red-500 hover:bg-gray-100"
                : dayOfWeek === 6
                ? "text-blue-500 hover:bg-gray-100"
                : "text-gray-900 hover:bg-gray-100"
              : "text-gray-300 cursor-not-allowed"
          }`}
          style={{ backgroundColor: isSelected ? theme.primary : undefined }}
        >
          {day}
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
          disabled={!canGoPrev()}
          className={`p-2 rounded-lg transition-colors ${
            canGoPrev() ? "hover:bg-gray-100 text-gray-700" : "text-gray-300 cursor-not-allowed"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-medium text-gray-900">
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
        </span>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {renderCalendar()}

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-gray-500 justify-center">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-200 rounded" />
          定休日・過去
        </span>
      </div>
    </div>
  );
}
