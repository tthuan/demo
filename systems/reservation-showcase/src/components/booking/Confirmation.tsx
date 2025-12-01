"use client";

import { BusinessConfig, Service, CustomerFormData } from "@/types";
import Button from "../common/Button";

interface ConfirmationProps {
  config: BusinessConfig;
  selectedServices: Service[];
  selectedDate: string;
  selectedTime: string;
  customerData: CustomerFormData;
  onEdit: (step: number) => void;
  onConfirm: () => void;
  onBack: () => void;
  loading: boolean;
}

export default function Confirmation({
  config,
  selectedServices,
  selectedDate,
  selectedTime,
  customerData,
  onEdit,
  onConfirm,
  onBack,
  loading,
}: ConfirmationProps) {
  const { theme, type } = config;
  const isRestaurant = type === "restaurant";

  const totalPrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Format helpers
  const formatDateJapanese = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${days[date.getDay()]}）`;
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "保険適用";
    if (price === 0) return "無料";
    return `¥${price.toLocaleString("ja-JP")}`;
  };

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
        <h2 className="text-xl font-bold text-gray-900 mb-2">ご予約内容の確認</h2>
        <p className="text-gray-600 text-sm">
          以下の内容でよろしければ「予約を確定する」を押してください
        </p>
      </div>

      {/* Service Summary */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">
            {isRestaurant ? "ご予約コース" : type === "clinic" ? "診療内容" : "ご予約メニュー"}
          </h3>
          <button onClick={() => onEdit(1)} className="text-sm hover:underline" style={{ color: theme.primary }}>
            変更する
          </button>
        </div>
        <div className="p-4 space-y-2">
          {selectedServices.map((service) => (
            <div key={service.id} className="flex justify-between text-sm">
              <span className="text-gray-700">{service.name}（{formatDuration(service.duration)}）</span>
              <span className="font-medium">{formatPrice(service.price)}</span>
            </div>
          ))}
          {totalPrice > 0 && (
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="font-medium text-gray-900">合計</span>
              <span className="font-bold" style={{ color: theme.primary }}>{formatPrice(totalPrice)}</span>
            </div>
          )}
          <div className="text-sm text-gray-500">所要時間：約{formatDuration(totalDuration)}</div>
        </div>
      </div>

      {/* Date/Time Summary */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">ご予約日時</h3>
          <button onClick={() => onEdit(2)} className="text-sm hover:underline" style={{ color: theme.primary }}>
            変更する
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-900">{formatDateJapanese(selectedDate)} {selectedTime}〜</p>
        </div>
      </div>

      {/* Customer Info Summary */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">お客様情報</h3>
          <button onClick={() => onEdit(3)} className="text-sm hover:underline" style={{ color: theme.primary }}>
            変更する
          </button>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex"><span className="text-gray-500 w-28">お名前</span><span className="text-gray-900">{customerData.name}</span></div>
          <div className="flex"><span className="text-gray-500 w-28">フリガナ</span><span className="text-gray-900">{customerData.nameKana}</span></div>
          <div className="flex"><span className="text-gray-500 w-28">電話番号</span><span className="text-gray-900">{customerData.phone}</span></div>
          <div className="flex"><span className="text-gray-500 w-28">メールアドレス</span><span className="text-gray-900 break-all">{customerData.email}</span></div>
          {customerData.birthdate && <div className="flex"><span className="text-gray-500 w-28">生年月日</span><span className="text-gray-900">{customerData.birthdate}</span></div>}
          {customerData.insuranceType && <div className="flex"><span className="text-gray-500 w-28">保険種別</span><span className="text-gray-900">{customerData.insuranceType}</span></div>}
          {customerData.partySize && <div className="flex"><span className="text-gray-500 w-28">人数</span><span className="text-gray-900">{customerData.partySize}名</span></div>}
          {customerData.seating && <div className="flex"><span className="text-gray-500 w-28">席の希望</span><span className="text-gray-900">{customerData.seating}</span></div>}
          {customerData.allergies && <div className="flex"><span className="text-gray-500 w-28">アレルギー</span><span className="text-gray-900">{customerData.allergies}</span></div>}
          {customerData.occasion && <div className="flex"><span className="text-gray-500 w-28">ご利用目的</span><span className="text-gray-900">{customerData.occasion}</span></div>}
          {customerData.notes && <div className="flex"><span className="text-gray-500 w-28">ご要望・備考</span><span className="text-gray-900">{customerData.notes}</span></div>}
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: theme.secondary }}>
        <p className="font-medium text-gray-900 mb-1">キャンセルについて</p>
        <p className="text-gray-600">前日までにご連絡ください</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} fullWidth disabled={loading} themeColor={theme.primary}>
          戻る
        </Button>
        <Button onClick={onConfirm} fullWidth loading={loading} size="lg" themeColor={theme.primary}>
          予約を確定する
        </Button>
      </div>
    </div>
  );
}
