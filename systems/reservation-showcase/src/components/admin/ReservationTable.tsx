"use client";

import { ReservationData, BusinessConfig } from "@/types";

interface ReservationTableProps {
  reservations: ReservationData[];
  config: BusinessConfig;
  onViewDetail: (reservation: ReservationData) => void;
  onStatusChange: (id: string, status: ReservationData["status"]) => void;
}

export default function ReservationTable({
  reservations,
  config,
  onViewDetail,
  onStatusChange,
}: ReservationTableProps) {
  const { theme, type } = config;

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${date.getMonth() + 1}/${date.getDate()}（${days[date.getDay()]}）`;
  };

  // Get status style
  const getStatusStyle = (status: ReservationData["status"]) => {
    switch (status) {
      case "確定":
        return "bg-blue-100 text-blue-800";
      case "完了":
        return "bg-green-100 text-green-800";
      case "キャンセル":
        return "bg-gray-100 text-gray-600";
    }
  };

  // Get content display based on business type
  const getContent = (reservation: ReservationData) => {
    if (type === "restaurant") {
      return `${reservation.services?.[0]?.name || ""} ${reservation.partySize || ""}名`;
    }
    return reservation.services?.map((s) => s.name).join("、") || "";
  };

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500">予約データがありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">予約番号</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">お客様名</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">内容</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-900">{reservation.reservationNumber}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(reservation.date)}</div>
                  <div className="text-sm text-gray-500">{reservation.time}〜</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.customerName}</div>
                  <div className="text-xs text-gray-500">{reservation.customerNameKana}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">{getContent(reservation)}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewDetail(reservation)}
                      className="text-sm hover:underline"
                      style={{ color: theme.primary }}
                    >
                      詳細
                    </button>
                    {reservation.status === "確定" && (
                      <>
                        <button
                          onClick={() => onStatusChange(reservation.id!, "完了")}
                          className="text-sm text-green-600 hover:underline"
                        >
                          完了
                        </button>
                        <button
                          onClick={() => onStatusChange(reservation.id!, "キャンセル")}
                          className="text-sm text-gray-500 hover:underline"
                        >
                          取消
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-gray-500">{reservation.reservationNumber}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(reservation.status)}`}>
                {reservation.status}
              </span>
            </div>
            <div className="mb-2">
              <div className="font-medium text-gray-900">{reservation.customerName}</div>
              <div className="text-sm text-gray-600">{formatDate(reservation.date)} {reservation.time}〜</div>
              <div className="text-sm text-gray-500">{getContent(reservation)}</div>
            </div>
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => onViewDetail(reservation)}
                className="text-sm font-medium hover:underline"
                style={{ color: theme.primary }}
              >
                詳細を見る
              </button>
              {reservation.status === "確定" && (
                <>
                  <button
                    onClick={() => onStatusChange(reservation.id!, "完了")}
                    className="text-sm font-medium text-green-600 hover:underline"
                  >
                    完了
                  </button>
                  <button
                    onClick={() => onStatusChange(reservation.id!, "キャンセル")}
                    className="text-sm font-medium text-gray-500 hover:underline"
                  >
                    取消
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
