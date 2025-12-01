"use client";

import { useState, useEffect } from "react";
import { businessConfig } from "@/lib/config";
import { getBookedTimeSlots } from "@/lib/supabase";
import Button from "../common/Button";

interface DateTimeSelectionProps {
  selectedDate: string;
  selectedTime: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DateTimeSelection({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onNext,
  onBack,
}: DateTimeSelectionProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      getBookedTimeSlots(selectedDate)
        .then(setBookedSlots)
        .finally(() => setLoading(false));
    }
  }, [selectedDate]);

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

  // Check if date is available
  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Past dates not available
    if (date < today) return false;

    // Closed days (Tuesday = 2)
    if (businessConfig.closedDayNumbers.includes(date.getDay())) return false;

    return true;
  };

  // Format date to Japanese format
  const formatDateJapanese = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];
    return `${year}年${month}月${day}日（${dayOfWeek}）`;
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

  // Can go to prev month only if it's current month or later
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
          style={{
            backgroundColor: isSelected
              ? businessConfig.theme.primary
              : undefined,
          }}
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">日時選択</h2>
        <p className="text-gray-600 text-sm">
          ご希望の日時をお選びください
        </p>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevMonth}
            disabled={!canGoPrev()}
            className={`p-2 rounded-lg transition-colors ${
              canGoPrev()
                ? "hover:bg-gray-100 text-gray-700"
                : "text-gray-300 cursor-not-allowed"
            }`}
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
        <div className="flex gap-4 mt-4 text-xs text-gray-500 justify-center">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-200 rounded" />
            定休日・過去
          </span>
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-3">
            {formatDateJapanese(selectedDate)}の空き時間
          </h3>

          {loading ? (
            <div className="flex justify-center py-4">
              <svg
                className="animate-spin h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {businessConfig.timeSlots.map((time) => {
                const isBooked = bookedSlots.includes(time);
                const isSelected = selectedTime === time;

                return (
                  <button
                    key={time}
                    onClick={() => !isBooked && onTimeSelect(time)}
                    disabled={isBooked}
                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                      isSelected
                        ? "text-white"
                        : isBooked
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? businessConfig.theme.primary
                        : undefined,
                    }}
                  >
                    {isBooked ? "×" : time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} fullWidth>
          戻る
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          fullWidth
        >
          お客様情報入力へ
        </Button>
      </div>
    </div>
  );
}
