"use client";

import Link from "next/link";
import { BusinessConfig, ReservationData } from "@/types";
import Button from "../common/Button";

interface CompletionProps {
  config: BusinessConfig;
  reservation: ReservationData;
}

export default function Completion({ config, reservation }: CompletionProps) {
  const { theme } = config;

  // Format helpers
  const formatDateJapanese = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${days[date.getDay()]}）`;
  };

  const formatPrice = (price: number) => `¥${price.toLocaleString("ja-JP")}`;

  // Generate iCal file
  const generateICS = () => {
    const startDate = new Date(`${reservation.date}T${reservation.time}:00`);
    const duration = reservation.services?.reduce((sum, s) => sum + s.duration, 0) || 60;
    const endDate = new Date(startDate.getTime() + duration * 60000);

    const formatICSDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

    const serviceName = reservation.services?.map((s) => s.name).join("、") || "予約";

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//${config.name}//Reservation//JP
BEGIN:VEVENT
UID:${reservation.reservationNumber}@demo.jp
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${config.name} - ${serviceName}
LOCATION:${config.address}
DESCRIPTION:予約番号: ${reservation.reservationNumber}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reservation.reservationNumber}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalPrice = reservation.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;

  return (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.secondary }}
        >
          <svg
            className="w-10 h-10"
            style={{ color: theme.primary }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Thank you message */}
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.primary }}>
          ご予約ありがとうございます
        </h2>
        <p className="text-gray-600">
          ご予約を承りました。確認メールをお送りいたしましたのでご確認ください。
        </p>
      </div>

      {/* Reservation Number */}
      <div className="p-4 rounded-xl" style={{ backgroundColor: theme.secondary }}>
        <p className="text-sm text-gray-600 mb-1">予約番号</p>
        <p className="text-xl font-bold" style={{ color: theme.primary }}>
          {reservation.reservationNumber}
        </p>
      </div>

      {/* Reservation Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-left">
        <h3 className="font-medium text-gray-900 mb-3 text-center">ご予約内容</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">日時</span>
            <span className="text-gray-900">{formatDateJapanese(reservation.date)} {reservation.time}〜</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">内容</span>
            <span className="text-gray-900">{reservation.services?.map((s) => s.name).join("、")}</span>
          </div>
          {reservation.partySize && (
            <div className="flex justify-between">
              <span className="text-gray-500">人数</span>
              <span className="text-gray-900">{reservation.partySize}名</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">お名前</span>
            <span className="text-gray-900">{reservation.customerName} 様</span>
          </div>
          {totalPrice > 0 && (
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="text-gray-900 font-medium">合計金額</span>
              <span className="font-bold" style={{ color: theme.primary }}>{formatPrice(totalPrice)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-900 mb-2">{config.icon} {config.name}</p>
        <p>{config.address}</p>
        <p>TEL: {config.phone}</p>
        <p>営業時間: {config.hours}</p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button onClick={generateICS} variant="outline" fullWidth themeColor={theme.primary}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          カレンダーに追加
        </Button>
        <Link href="/" className="block">
          <Button fullWidth themeColor={theme.primary}>
            デモ一覧に戻る
          </Button>
        </Link>
      </div>
    </div>
  );
}
