"use client";

import { BusinessConfig, Service } from "@/types";
import Button from "../common/Button";

interface ServiceSelectorProps {
  config: BusinessConfig;
  selectedServices: Service[];
  onServiceToggle: (service: Service) => void;
  onNext: () => void;
}

export default function ServiceSelector({
  config,
  selectedServices,
  onServiceToggle,
  onNext,
}: ServiceSelectorProps) {
  const { theme, services, type } = config;
  const isRestaurant = type === "restaurant";

  // Calculate totals
  const totalPrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const isSelected = (service: Service) =>
    selectedServices.some((s) => s.id === service.id);

  // Format price
  const formatPrice = (price: number | null) => {
    if (price === null) return "保険適用";
    if (price === 0) return "無料";
    return `¥${price.toLocaleString("ja-JP")}${isRestaurant ? "" : "（税込）"}`;
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
    }
    return `${minutes}分`;
  };

  // Get label based on business type
  const getLabel = () => {
    switch (type) {
      case "salon":
        return { title: "メニュー選択", subtitle: "ご希望のメニューをお選びください（複数選択可）" };
      case "clinic":
        return { title: "診療内容選択", subtitle: "ご希望の診療内容をお選びください" };
      case "restaurant":
        return { title: "コース選択", subtitle: "ご希望のコースをお選びください" };
    }
  };

  const labels = getLabel();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{labels.title}</h2>
        <p className="text-gray-600 text-sm">{labels.subtitle}</p>
      </div>

      {/* Service Cards */}
      <div className="grid gap-3">
        {services.map((service) => {
          const selected = isSelected(service);
          return (
            <button
              key={service.id}
              onClick={() => {
                // For restaurant, allow only single selection
                if (isRestaurant && !selected) {
                  selectedServices.forEach((s) => onServiceToggle(s));
                }
                onServiceToggle(service);
              }}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected ? "border-current" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              style={{
                borderColor: selected ? theme.primary : undefined,
                backgroundColor: selected ? theme.secondary : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{service.name}</span>
                    <span className="text-sm text-gray-500">
                      （{formatDuration(service.duration)}）
                    </span>
                  </div>
                  <p className="text-lg font-bold mt-1" style={{ color: theme.primary }}>
                    {formatPrice(service.price)}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selected ? "border-current bg-current" : "border-gray-300 bg-white"
                  }`}
                  style={{
                    borderColor: selected ? theme.primary : undefined,
                    backgroundColor: selected ? theme.primary : undefined,
                  }}
                >
                  {selected && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
        <div className="p-4 rounded-xl" style={{ backgroundColor: theme.secondary }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">選択{isRestaurant ? "コース" : "メニュー"}</span>
            <span className="font-medium">{selectedServices.map((s) => s.name).join("、")}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">所要時間</span>
            <span className="font-medium">{formatDuration(totalDuration)}</span>
          </div>
          {totalPrice > 0 && (
            <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: `${theme.primary}33` }}>
              <span className="text-gray-900 font-medium">合計金額</span>
              <span className="text-xl font-bold" style={{ color: theme.primary }}>
                {formatPrice(totalPrice)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={selectedServices.length === 0}
        fullWidth
        size="lg"
        themeColor={theme.primary}
      >
        日時選択へ進む
      </Button>
    </div>
  );
}
