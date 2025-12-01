"use client";

import { Service, CustomerFormData, businessConfig } from "@/lib/config";
import Button from "../common/Button";

interface ConfirmationProps {
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
  selectedServices,
  selectedDate,
  selectedTime,
  customerData,
  onEdit,
  onConfirm,
  onBack,
  loading,
}: ConfirmationProps) {
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

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
          ご予約内容の確認
        </h2>
        <p className="text-gray-600 text-sm">
          以下の内容でよろしければ「予約を確定する」を押してください
        </p>
      </div>

      {/* Service Summary */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">ご予約メニュー</h3>
          <button
            onClick={() => onEdit(1)}
            className="text-sm hover:underline"
            style={{ color: businessConfig.theme.primary }}
          >
            変更する
          </button>
        </div>
        <div className="p-4 space-y-2">
          {selectedServices.map((service) => (
            <div key={service.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {service.name}（{formatDuration(service.duration)}）
              </span>
              <span className="font-medium">{formatPrice(service.price)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span className="font-medium text-gray-900">合計</span>
            <span
              className="font-bold"
              style={{ color: businessConfig.theme.primary }}
            >
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            所要時間：約{formatDuration(totalDuration)}
          </div>
        </div>
      </div>

      {/* Date/Time Summary */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">ご予約日時</h3>
          <button
            onClick={() => onEdit(2)}
            className="text-sm hover:underline"
            style={{ color: businessConfig.theme.primary }}
          >
            変更する
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-900">
            {formatDateJapanese(selectedDate)} {selectedTime}〜
          </p>
        </div>
      </div>

      {/* Customer Info Summary */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">お客様情報</h3>
          <button
            onClick={() => onEdit(3)}
            className="text-sm hover:underline"
            style={{ color: businessConfig.theme.primary }}
          >
            変更する
          </button>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex">
            <span className="text-gray-500 w-28">お名前</span>
            <span className="text-gray-900">{customerData.customerName}</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-28">フリガナ</span>
            <span className="text-gray-900">{customerData.customerNameKana}</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-28">電話番号</span>
            <span className="text-gray-900">{customerData.phone}</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-28">メールアドレス</span>
            <span className="text-gray-900 break-all">{customerData.email}</span>
          </div>
          {customerData.notes && (
            <div className="flex">
              <span className="text-gray-500 w-28">ご要望・備考</span>
              <span className="text-gray-900">{customerData.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Policy */}
      <div
        className="p-4 rounded-xl text-sm"
        style={{ backgroundColor: businessConfig.theme.secondary }}
      >
        <p className="font-medium text-gray-900 mb-1">キャンセルについて</p>
        <p className="text-gray-600">{businessConfig.bookingFlow.cancellationPolicy}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} fullWidth disabled={loading}>
          戻る
        </Button>
        <Button onClick={onConfirm} fullWidth loading={loading} size="lg">
          予約を確定する
        </Button>
      </div>
    </div>
  );
}
