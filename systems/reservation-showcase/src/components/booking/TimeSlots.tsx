"use client";

import { BusinessConfig, Service } from "@/types";
import { getTimeSlotsArray } from "@/config/businesses";

interface TimeSlotsProps {
  config: BusinessConfig;
  selectedDate: string;
  selectedTime: string;
  selectedService?: Service;
  bookedSlots: string[];
  loading: boolean;
  onTimeSelect: (time: string) => void;
}

export default function TimeSlots({
  config,
  selectedDate,
  selectedTime,
  selectedService,
  bookedSlots,
  loading,
  onTimeSelect,
}: TimeSlotsProps) {
  const { theme, type } = config;
  const isRestaurant = type === "restaurant";

  // Format date to Japanese
  const formatDateJapanese = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];
    return `${year}年${month}月${day}日（${dayOfWeek}）`;
  };

  // Get time slots based on business type and selected service
  const getTimeSlots = (): { label?: string; slots: string[] }[] => {
    if (isRestaurant && !Array.isArray(config.timeSlots)) {
      const timeSlots = config.timeSlots as { lunch: string[]; dinner: string[] };
      // Determine which slots to show based on selected course
      if (selectedService?.id === "lunch") {
        return [{ label: "ランチ", slots: timeSlots.lunch }];
      } else if (selectedService) {
        return [{ label: "ディナー", slots: timeSlots.dinner }];
      }
      return [
        { label: "ランチ", slots: timeSlots.lunch },
        { label: "ディナー", slots: timeSlots.dinner },
      ];
    }
    return [{ slots: getTimeSlotsArray(config) }];
  };

  const timeSlotGroups = getTimeSlots();

  if (!selectedDate) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-3">
        {formatDateJapanese(selectedDate)}の空き時間
      </h3>

      {loading ? (
        <div className="flex justify-center py-4">
          <svg className="animate-spin h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        <div className="space-y-4">
          {timeSlotGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.label && (
                <p className="text-sm font-medium text-gray-600 mb-2">{group.label}</p>
              )}
              <div className="grid grid-cols-4 gap-2">
                {group.slots.map((time) => {
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
                        backgroundColor: isSelected ? theme.primary : undefined,
                      }}
                    >
                      {isBooked ? "×" : time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
