"use client";

import { useState, useEffect } from "react";
import { ReservationData, businessConfig } from "@/lib/config";
import { getReservations, updateReservationStatus } from "@/lib/supabase";
import {
  LoginForm,
  ReservationTable,
  ReservationDetail,
  CalendarView,
} from "@/components/admin";
import Button from "@/components/common/Button";
import { ConfirmModal } from "@/components/common/Modal";

type TabType = "today" | "list" | "calendar";

// Mock data for demo when Supabase is not configured
const mockReservations: ReservationData[] = [
  {
    id: "1",
    reservationNumber: "HANA-20241201-001",
    customerName: "山田 花子",
    customerNameKana: "ヤマダ ハナコ",
    phone: "090-1234-5678",
    email: "hanako@example.com",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    services: [
      { id: "cut", name: "カット", duration: 60, price: 4400 },
      { id: "color", name: "カラー", duration: 90, price: 7700 },
    ],
    totalDuration: 150,
    totalPrice: 12100,
    status: "確定",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    reservationNumber: "HANA-20241201-002",
    customerName: "佐藤 太郎",
    customerNameKana: "サトウ タロウ",
    phone: "080-9876-5432",
    email: "taro@example.com",
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    services: [{ id: "cut", name: "カット", duration: 60, price: 4400 }],
    totalDuration: 60,
    totalPrice: 4400,
    status: "確定",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    reservationNumber: "HANA-20241202-001",
    customerName: "田中 美咲",
    customerNameKana: "タナカ ミサキ",
    phone: "070-1111-2222",
    email: "misaki@example.com",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "11:00",
    services: [
      { id: "perm", name: "パーマ", duration: 120, price: 8800 },
      { id: "treatment", name: "トリートメント", duration: 30, price: 3300 },
    ],
    totalDuration: 150,
    totalPrice: 12100,
    status: "確定",
    createdAt: new Date().toISOString(),
  },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationData | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    reservationId: string;
    newStatus: ReservationData["status"];
  }>({ isOpen: false, reservationId: "", newStatus: "確定" });
  const [dateFilter, setDateFilter] = useState("");

  // Check auth on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authenticated");
    setIsAuthenticated(auth === "true");
    setIsCheckingAuth(false);
  }, []);

  // Fetch reservations
  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated, activeTab, dateFilter]);

  const fetchReservations = async () => {
    setLoading(true);

    try {
      let data: ReservationData[] = [];
      const today = new Date().toISOString().split("T")[0];

      if (activeTab === "today") {
        data = await getReservations({ startDate: today, endDate: today });
      } else {
        data = await getReservations();
      }

      // If no data from Supabase, use mock data for demo
      if (data.length === 0) {
        console.log("Using mock data (Supabase not configured)");
        if (activeTab === "today") {
          data = mockReservations.filter((r) => r.date === today);
        } else {
          data = mockReservations;
        }
      }

      // Apply date filter for list view
      if (dateFilter && activeTab === "list") {
        data = data.filter((r) => r.date === dateFilter);
      }

      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      // Use mock data on error
      const today = new Date().toISOString().split("T")[0];
      if (activeTab === "today") {
        setReservations(mockReservations.filter((r) => r.date === today));
      } else {
        setReservations(mockReservations);
      }
    }

    setLoading(false);
  };

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
  };

  const handleViewDetail = (reservation: ReservationData) => {
    setSelectedReservation(reservation);
    setShowDetail(true);
  };

  const handleStatusChangeRequest = (
    id: string,
    status: ReservationData["status"]
  ) => {
    setConfirmModal({ isOpen: true, reservationId: id, newStatus: status });
  };

  const handleStatusChange = async () => {
    const { reservationId, newStatus } = confirmModal;

    const success = await updateReservationStatus(reservationId, newStatus);

    if (success) {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId ? { ...r, status: newStatus } : r
        )
      );
    } else {
      // Update local state for demo
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId ? { ...r, status: newStatus } : r
        )
      );
    }

    setConfirmModal({ isOpen: false, reservationId: "", newStatus: "確定" });
    setShowDetail(false);
  };

  const handleDateSelectFromCalendar = (date: string) => {
    setDateFilter(date);
    setActiveTab("list");
  };

  // Loading check
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Get today's count
  const today = new Date().toISOString().split("T")[0];
  const todayCount = reservations.filter(
    (r) => r.date === today && r.status !== "キャンセル"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-lg font-bold"
                style={{ color: businessConfig.theme.primary }}
              >
                {businessConfig.name}
              </h1>
              <p className="text-xs text-gray-500">管理画面</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: businessConfig.theme.secondary }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: businessConfig.theme.primary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">本日の予約</p>
              <p
                className="text-2xl font-bold"
                style={{ color: businessConfig.theme.primary }}
              >
                {activeTab === "today" ? reservations.length : todayCount}件
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setActiveTab("today");
              setDateFilter("");
            }}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === "today"
                ? "text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
            style={{
              backgroundColor:
                activeTab === "today"
                  ? businessConfig.theme.primary
                  : undefined,
            }}
          >
            今日の予約
          </button>
          <button
            onClick={() => {
              setActiveTab("list");
              setDateFilter("");
            }}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === "list"
                ? "text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
            style={{
              backgroundColor:
                activeTab === "list" ? businessConfig.theme.primary : undefined,
            }}
          >
            予約一覧
          </button>
          <button
            onClick={() => {
              setActiveTab("calendar");
              setDateFilter("");
            }}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === "calendar"
                ? "text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
            style={{
              backgroundColor:
                activeTab === "calendar"
                  ? businessConfig.theme.primary
                  : undefined,
            }}
          >
            カレンダー
          </button>
        </div>

        {/* Date Filter for List View */}
        {activeTab === "list" && (
          <div className="mb-4 flex gap-2 items-center">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                クリア
              </button>
            )}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full" />
          </div>
        ) : activeTab === "calendar" ? (
          <CalendarView
            reservations={reservations}
            onDateSelect={handleDateSelectFromCalendar}
          />
        ) : (
          <ReservationTable
            reservations={reservations}
            onViewDetail={handleViewDetail}
            onStatusChange={handleStatusChangeRequest}
          />
        )}
      </main>

      {/* Reservation Detail Modal */}
      <ReservationDetail
        reservation={selectedReservation}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onStatusChange={handleStatusChangeRequest}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, reservationId: "", newStatus: "確定" })
        }
        onConfirm={handleStatusChange}
        title={
          confirmModal.newStatus === "完了"
            ? "予約を完了にする"
            : "予約をキャンセルする"
        }
        message={
          confirmModal.newStatus === "完了"
            ? "この予約を完了にしますか？"
            : "この予約をキャンセルしますか？この操作は取り消せません。"
        }
        confirmText={confirmModal.newStatus === "完了" ? "完了にする" : "キャンセル"}
      />
    </div>
  );
}
