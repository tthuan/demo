"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  businessConfigs,
  isValidBusinessType,
} from "@/config/businesses";
import {
  getReservations,
  getDashboardStats,
  updateReservationStatus,
} from "@/lib/supabase";
import {
  LoginForm,
  StatsCards,
  ReservationTable,
  ReservationDetail,
} from "@/components/admin";
import { ConfirmModal } from "@/components/common/Modal";
import {
  BusinessConfig,
  BusinessType,
  ReservationData,
  DashboardStats,
} from "@/types";

// Mock data generator
function generateMockData(businessType: BusinessType): ReservationData[] {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const config = businessConfigs[businessType];

  const baseData = {
    businessType,
    status: "確定" as const,
  };

  if (businessType === "salon") {
    return [
      {
        ...baseData,
        id: "1",
        reservationNumber: "SALO-20241201-001",
        customerName: "山田 花子",
        customerNameKana: "ヤマダ ハナコ",
        phone: "090-1234-5678",
        email: "hanako@example.com",
        date: today,
        time: "10:00",
        services: [config.services[0], config.services[1]],
        notes: "明るめのカラー希望",
      },
      {
        ...baseData,
        id: "2",
        reservationNumber: "SALO-20241201-002",
        customerName: "佐藤 太郎",
        customerNameKana: "サトウ タロウ",
        phone: "080-9876-5432",
        email: "taro@example.com",
        date: today,
        time: "14:00",
        services: [config.services[0]],
      },
      {
        ...baseData,
        id: "3",
        reservationNumber: "SALO-20241202-001",
        customerName: "鈴木 美咲",
        customerNameKana: "スズキ ミサキ",
        phone: "070-1111-2222",
        email: "misaki@example.com",
        date: tomorrow,
        time: "11:00",
        services: [config.services[2], config.services[3]],
      },
    ];
  }

  if (businessType === "clinic") {
    return [
      {
        ...baseData,
        id: "1",
        reservationNumber: "CLIN-20241201-001",
        customerName: "田中 健一",
        customerNameKana: "タナカ ケンイチ",
        phone: "090-2222-3333",
        email: "kenichi@example.com",
        date: today,
        time: "9:00",
        services: [config.services[0]],
        insuranceType: "社会保険",
        notes: "風邪の症状",
      },
      {
        ...baseData,
        id: "2",
        reservationNumber: "CLIN-20241201-002",
        customerName: "高橋 由美",
        customerNameKana: "タカハシ ユミ",
        phone: "080-4444-5555",
        email: "yumi@example.com",
        date: today,
        time: "10:30",
        services: [config.services[1]],
        insuranceType: "国民健康保険",
      },
      {
        ...baseData,
        id: "3",
        reservationNumber: "CLIN-20241202-001",
        customerName: "伊藤 雄太",
        customerNameKana: "イトウ ユウタ",
        phone: "070-6666-7777",
        email: "yuta@example.com",
        date: tomorrow,
        time: "14:30",
        services: [config.services[2]],
        insuranceType: "自費",
      },
    ];
  }

  // Restaurant
  return [
    {
      ...baseData,
      id: "1",
      reservationNumber: "REST-20241201-001",
      customerName: "中村 誠",
      customerNameKana: "ナカムラ マコト",
      phone: "090-8888-9999",
      email: "makoto@example.com",
      date: today,
      time: "12:00",
      services: [config.services[0]],
      partySize: 2,
      seatingPreference: "テーブル席",
      occasion: "デート",
    },
    {
      ...baseData,
      id: "2",
      reservationNumber: "REST-20241201-002",
      customerName: "小林 株式会社",
      customerNameKana: "コバヤシ カブシキガイシャ",
      phone: "03-1234-5678",
      email: "kobayashi@company.jp",
      date: today,
      time: "18:30",
      services: [config.services[2]],
      partySize: 6,
      seatingPreference: "個室（+¥2,200）",
      occasion: "接待",
      notes: "重要なお客様です",
    },
    {
      ...baseData,
      id: "3",
      reservationNumber: "REST-20241202-001",
      customerName: "渡辺 家",
      customerNameKana: "ワタナベ ケ",
      phone: "080-1010-2020",
      email: "watanabe@example.com",
      date: tomorrow,
      time: "11:30",
      services: [config.services[0]],
      partySize: 4,
      seatingPreference: "テーブル席",
      occasion: "家族食事",
      allergies: "えび、かに",
    },
  ];
}

export default function AdminPage() {
  const params = useParams();
  const businessType = params.businessType as string;

  if (!isValidBusinessType(businessType)) {
    notFound();
  }

  const config: BusinessConfig = businessConfigs[businessType as BusinessType];
  const { theme } = config;

  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<"today" | "list">("today");
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    todayCount: 0,
    monthCount: 0,
    cancelRate: 0,
  });
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

  // Check auth
  useEffect(() => {
    const auth = sessionStorage.getItem(`admin_auth_${businessType}`);
    setIsAuthenticated(auth === "true");
    setIsCheckingAuth(false);
  }, [businessType]);

  // Fetch data
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab, dateFilter, businessType]);

  const fetchData = async () => {
    setLoading(true);

    const today = new Date().toISOString().split("T")[0];

    // Fetch stats
    const statsData = await getDashboardStats(businessType as BusinessType);

    // Fetch reservations
    let filters: { startDate?: string; endDate?: string } | undefined;
    if (activeTab === "today") {
      filters = { startDate: today, endDate: today };
    } else if (dateFilter) {
      filters = { startDate: dateFilter, endDate: dateFilter };
    }

    let data = await getReservations(businessType as BusinessType, filters);

    // Use mock data if empty
    if (data.length === 0) {
      console.log("Using mock data");
      const mockData = generateMockData(businessType as BusinessType);
      if (activeTab === "today") {
        data = mockData.filter((r) => r.date === today);
      } else if (dateFilter) {
        data = mockData.filter((r) => r.date === dateFilter);
      } else {
        data = mockData;
      }
    }

    // Update stats with mock if needed
    if (statsData.todayCount === 0 && statsData.monthCount === 0) {
      const mockData = generateMockData(businessType as BusinessType);
      const todayMock = mockData.filter((r) => r.date === today);
      setStats({
        todayCount: todayMock.length,
        monthCount: mockData.length,
        cancelRate: 0,
      });
    } else {
      setStats(statsData);
    }

    setReservations(data);
    setLoading(false);
  };

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(`admin_auth_${businessType}`);
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

    await updateReservationStatus(reservationId, newStatus);

    // Update local state
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, status: newStatus } : r
      )
    );

    setConfirmModal({ isOpen: false, reservationId: "", newStatus: "確定" });
    setShowDetail(false);
  };

  // Loading
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div
          className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full"
          style={{ borderColor: theme.primary, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  // Login
  if (!isAuthenticated) {
    return <LoginForm config={config} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors"
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
              </Link>
              <div>
                <h1
                  className="text-lg font-bold flex items-center gap-2"
                  style={{ color: theme.primary }}
                >
                  <span>{config.icon}</span>
                  {config.name}
                </h1>
                <p className="text-xs text-gray-500">管理画面</p>
              </div>
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

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="mb-6">
          <StatsCards
            stats={stats}
            themeColor={theme.primary}
            secondaryColor={theme.secondary}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab("today");
              setDateFilter("");
            }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "today"
                ? "text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
            style={{
              backgroundColor: activeTab === "today" ? theme.primary : undefined,
            }}
          >
            今日の予約
          </button>
          <button
            onClick={() => {
              setActiveTab("list");
              setDateFilter("");
            }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "list"
                ? "text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
            style={{
              backgroundColor: activeTab === "list" ? theme.primary : undefined,
            }}
          >
            予約一覧
          </button>
        </div>

        {/* Date Filter */}
        {activeTab === "list" && (
          <div className="mb-4 flex gap-2 items-center">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2"
              style={
                { "--tw-ring-color": theme.primary } as React.CSSProperties
              }
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
            <div
              className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full"
              style={{ borderColor: theme.primary, borderTopColor: "transparent" }}
            />
          </div>
        ) : (
          <ReservationTable
            reservations={reservations}
            config={config}
            onViewDetail={handleViewDetail}
            onStatusChange={handleStatusChangeRequest}
          />
        )}
      </main>

      {/* Detail Modal */}
      <ReservationDetail
        reservation={selectedReservation}
        config={config}
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
            : "この予約をキャンセルしますか？"
        }
        confirmText={confirmModal.newStatus === "完了" ? "完了にする" : "キャンセル"}
        themeColor={theme.primary}
      />
    </div>
  );
}
