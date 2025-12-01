"use client";

import { ReservationData, BusinessConfig } from "@/types";
import Modal from "../common/Modal";
import Button from "../common/Button";

interface ReservationDetailProps {
  reservation: ReservationData | null;
  config: BusinessConfig;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: ReservationData["status"]) => void;
}

export default function ReservationDetail({
  reservation,
  config,
  isOpen,
  onClose,
  onStatusChange,
}: ReservationDetailProps) {
  if (!reservation) return null;

  const { theme } = config;

  // Format helpers
  const formatDate = (dateStr: string) => {
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

  const getStatusStyle = (status: ReservationData["status"]) => {
    switch (status) {
      case "確定": return "bg-blue-100 text-blue-800";
      case "完了": return "bg-green-100 text-green-800";
      case "キャンセル": return "bg-gray-100 text-gray-600";
    }
  };

  const totalPrice = reservation.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;
  const totalDuration = reservation.services?.reduce((sum, s) => sum + s.duration, 0) || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="予約詳細" size="lg">
      <div className="space-y-4">
        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-mono text-gray-500">{reservation.reservationNumber}</span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(reservation.status)}`}>
            {reservation.status}
          </span>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">お客様情報</h3>
          <div className="space-y-1">
            <p className="text-gray-900 font-medium">
              {reservation.customerName}（{reservation.customerNameKana}）
            </p>
            <p className="text-sm text-gray-600">TEL: {reservation.phone}</p>
            <p className="text-sm text-gray-600">Email: {reservation.email}</p>
            {reservation.partySize && (
              <p className="text-sm text-gray-600">人数: {reservation.partySize}名</p>
            )}
            {reservation.seatingPreference && (
              <p className="text-sm text-gray-600">席: {reservation.seatingPreference}</p>
            )}
            {reservation.insuranceType && (
              <p className="text-sm text-gray-600">保険: {reservation.insuranceType}</p>
            )}
            {reservation.allergies && (
              <p className="text-sm text-gray-600">アレルギー: {reservation.allergies}</p>
            )}
            {reservation.occasion && (
              <p className="text-sm text-gray-600">目的: {reservation.occasion}</p>
            )}
          </div>
        </div>

        {/* Reservation Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">予約内容</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">日時</span>
              <span className="text-gray-900 font-medium">{formatDate(reservation.date)} {reservation.time}〜</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">所要時間</span>
              <span className="text-gray-900">{formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>

        {/* Services */}
        {reservation.services && reservation.services.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">メニュー</h3>
            <div className="space-y-2">
              {reservation.services.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span className="text-gray-900">{service.name}</span>
                  <span className="text-gray-600">{formatPrice(service.price)}</span>
                </div>
              ))}
              {totalPrice > 0 && (
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-900">合計</span>
                  <span className="font-bold" style={{ color: theme.primary }}>{formatPrice(totalPrice)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {reservation.notes && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">ご要望・備考</h3>
            <p className="text-gray-900 text-sm">{reservation.notes}</p>
          </div>
        )}

        {/* Actions */}
        {reservation.status === "確定" && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => onStatusChange(reservation.id!, "キャンセル")}
              fullWidth
              themeColor={theme.primary}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => onStatusChange(reservation.id!, "完了")}
              fullWidth
              themeColor={theme.primary}
            >
              完了にする
            </Button>
          </div>
        )}

        <Button variant="ghost" onClick={onClose} fullWidth>
          閉じる
        </Button>
      </div>
    </Modal>
  );
}
