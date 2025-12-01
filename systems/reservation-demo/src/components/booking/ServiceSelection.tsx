"use client";

import { businessConfig, Service } from "@/lib/config";
import Button from "../common/Button";

interface ServiceSelectionProps {
  selectedServices: Service[];
  onServiceToggle: (service: Service) => void;
  onNext: () => void;
}

export default function ServiceSelection({
  selectedServices,
  onServiceToggle,
  onNext,
}: ServiceSelectionProps) {
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const isSelected = (service: Service) =>
    selectedServices.some((s) => s.id === service.id);

  // Format price with Japanese yen
  const formatPrice = (price: number) =>
    `¥${price.toLocaleString("ja-JP")}（税込）`;

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
    }
    return `${minutes}分`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          メニュー選択
        </h2>
        <p className="text-gray-600 text-sm">
          ご希望のメニューをお選びください（複数選択可）
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid gap-3">
        {businessConfig.services.map((service) => {
          const selected = isSelected(service);
          return (
            <button
              key={service.id}
              onClick={() => onServiceToggle(service)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              style={{
                borderColor: selected ? businessConfig.theme.primary : undefined,
                backgroundColor: selected ? businessConfig.theme.secondary : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {service.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      （{formatDuration(service.duration)}）
                    </span>
                  </div>
                  <p
                    className="text-lg font-bold mt-1"
                    style={{ color: businessConfig.theme.primary }}
                  >
                    {formatPrice(service.price)}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selected
                      ? "border-pink-500 bg-pink-500"
                      : "border-gray-300 bg-white"
                  }`}
                  style={{
                    borderColor: selected
                      ? businessConfig.theme.primary
                      : undefined,
                    backgroundColor: selected
                      ? businessConfig.theme.primary
                      : undefined,
                  }}
                >
                  {selected && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Running Total */}
      {selectedServices.length > 0 && (
        <div
          className="p-4 rounded-xl"
          style={{ backgroundColor: businessConfig.theme.secondary }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">選択メニュー</span>
            <span className="font-medium">
              {selectedServices.map((s) => s.name).join("、")}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">所要時間</span>
            <span className="font-medium">{formatDuration(totalDuration)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-pink-200">
            <span className="text-gray-900 font-medium">合計金額</span>
            <span
              className="text-xl font-bold"
              style={{ color: businessConfig.theme.primary }}
            >
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      )}

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={selectedServices.length === 0}
        fullWidth
        size="lg"
      >
        日時選択へ進む
      </Button>
    </div>
  );
}
