"use client";

import { useState, useEffect } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import {
  businessConfigs,
  isValidBusinessType,
} from "@/config/businesses";
import { BusinessConfig, BusinessType } from "@/types";

// LIFF types
declare global {
  interface Window {
    liff: {
      init: (config: { liffId: string }) => Promise<void>;
      isLoggedIn: () => boolean;
      login: (config?: { redirectUri?: string }) => void;
      getProfile: () => Promise<{
        userId: string;
        displayName: string;
        pictureUrl?: string;
        statusMessage?: string;
      }>;
      isInClient: () => boolean;
      closeWindow: () => void;
      openWindow: (config: { url: string; external?: boolean }) => void;
      sendMessages: (messages: Array<{ type: string; text: string }>) => Promise<void>;
      ready: Promise<void>;
    };
  }
}

type LineView = "menu" | "booking" | "history" | "info";

interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

export default function LinePage() {
  const params = useParams();
  const router = useRouter();
  const businessType = params.businessType as string;

  if (!isValidBusinessType(businessType)) {
    notFound();
  }

  const config: BusinessConfig = businessConfigs[businessType as BusinessType];
  const { theme } = config;

  // State
  const [currentView, setCurrentView] = useState<LineView>("menu");
  const [showLiffNotice, setShowLiffNotice] = useState(true);
  const [liffInitialized, setLiffInitialized] = useState(false);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [isInLiff, setIsInLiff] = useState(false);

  // Get LIFF ID from environment
  const liffId = process.env[`NEXT_PUBLIC_LINE_${businessType.toUpperCase()}_LIFF_ID`] || "";

  // Initialize LIFF
  useEffect(() => {
    const initLiff = async () => {
      try {
        // Load LIFF SDK
        if (!window.liff) {
          const script = document.createElement("script");
          script.src = "https://static.line-scdn.net/liff/edge/2/sdk.js";
          script.async = true;
          document.body.appendChild(script);

          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load LIFF SDK"));
          });
        }

        // Initialize LIFF if ID is configured
        if (liffId) {
          await window.liff.init({ liffId });
          setLiffInitialized(true);
          setIsInLiff(window.liff.isInClient());

          // Get profile if logged in
          if (window.liff.isLoggedIn()) {
            const userProfile = await window.liff.getProfile();
            setProfile(userProfile);
          }
        } else {
          // Demo mode without real LIFF
          setLiffInitialized(true);
          setLiffError("demo");
        }
      } catch (error) {
        console.error("LIFF init error:", error);
        setLiffError("LIFF初期化エラー");
        setLiffInitialized(true);
      }
    };

    initLiff();
  }, [liffId]);

  // Handle LINE login
  const handleLogin = () => {
    if (window.liff && liffId) {
      window.liff.login();
    }
  };

  // Handle booking redirect
  const handleBooking = () => {
    const bookingUrl = `/demo/${businessType}`;

    if (isInLiff && window.liff) {
      // Open in LIFF browser
      window.liff.openWindow({
        url: window.location.origin + bookingUrl,
        external: false,
      });
    } else {
      router.push(bookingUrl);
    }
  };

  // Render LINE-style menu
  const renderMenu = () => (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Profile card if logged in */}
      {profile && (
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
          {profile.pictureUrl ? (
            <img
              src={profile.pictureUrl}
              alt={profile.displayName}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{profile.displayName}</p>
            <p className="text-xs text-gray-500">LINEログイン中</p>
          </div>
        </div>
      )}

      {/* Welcome message */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: theme.secondary }}
          >
            {config.icon}
          </div>
          <div>
            <p className="font-bold text-gray-900">{config.name}</p>
            <p className="text-xs text-gray-500">公式アカウント</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {config.name}の公式LINEアカウントです。
          下のメニューからご予約いただけます。
        </p>
      </div>

      {/* Login button if not logged in and LIFF is configured */}
      {!profile && liffId && !liffError && (
        <button
          onClick={handleLogin}
          className="w-full bg-[#06C755] text-white py-3 rounded-xl font-medium
                     flex items-center justify-center gap-2 hover:bg-[#05b34c] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 5.82 2 10.5c0 2.55 1.26 4.84 3.24 6.41-.14.51-.9 3.08-.93 3.31 0 0-.02.16.08.22.1.06.22.03.22.03.29-.04 3.37-2.2 3.9-2.57.81.12 1.64.18 2.49.18 5.52 0 10-3.82 10-8.5S17.52 2 12 2z"/>
          </svg>
          LINEでログイン
        </button>
      )}

      {/* Rich Menu Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setCurrentView("booking")}
          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all
                     flex flex-col items-center gap-2 active:scale-[0.98]"
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: theme.primary }}
          >
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-medium text-gray-800 text-sm">予約する</span>
        </button>

        <button
          onClick={() => setCurrentView("history")}
          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all
                     flex flex-col items-center gap-2 active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-100">
            <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span className="font-medium text-gray-800 text-sm">予約確認</span>
        </button>

        <button
          onClick={() => setCurrentView("info")}
          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all
                     flex flex-col items-center gap-2 active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-50">
            <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-medium text-gray-800 text-sm">店舗情報</span>
        </button>

        <a
          href={`tel:${config.phone}`}
          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all
                     flex flex-col items-center gap-2 active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-green-50">
            <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <span className="font-medium text-gray-800 text-sm">電話する</span>
        </a>
      </div>

      {/* Quick Info */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-2">営業時間</p>
        <p className="text-sm text-gray-700 font-medium">{config.hours}</p>
        <p className="text-xs text-gray-400 mt-1">定休日: {config.closedDays}</p>
      </div>
    </div>
  );

  // Render booking view
  const renderBooking = () => (
    <div className="p-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: theme.secondary }}
        >
          <svg
            className="w-8 h-8"
            style={{ color: theme.primary }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">予約ページを開きます</h3>
        <p className="text-sm text-gray-600 mb-6">
          {profile ? (
            <>
              <span className="font-medium text-gray-900">{profile.displayName}</span>さんの
              <br />
              情報が自動入力されます。
            </>
          ) : (
            <>
              LIFFアプリ内で予約フォームが開きます。
              <br />
              LINEログインで情報が自動入力されます。
            </>
          )}
        </p>
        <button
          onClick={handleBooking}
          className="block w-full py-3 rounded-xl text-white font-medium
                     transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: theme.primary }}
        >
          予約フォームを開く
        </button>
        <button
          onClick={() => setCurrentView("menu")}
          className="mt-3 text-sm text-gray-500 hover:text-gray-700"
        >
          戻る
        </button>
      </div>

      {/* LIFF Features */}
      <div className="mt-4 bg-blue-50 rounded-xl p-4">
        <p className="text-xs text-blue-700 font-medium mb-2">LINE連携機能</p>
        <ul className="text-xs text-blue-600 space-y-1">
          <li className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            LINEプロフィールから名前を自動取得
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            予約完了後にLINEで通知
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            予約リマインダーを自動送信
          </li>
        </ul>
      </div>
    </div>
  );

  // Render history
  const renderHistory = () => (
    <div className="p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">予約履歴</h3>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          {profile ? (
            <p className="text-gray-500 text-sm mb-4">予約履歴はありません</p>
          ) : (
            <p className="text-gray-500 text-sm mb-4">
              ログインすると予約履歴を<br />確認できます
            </p>
          )}
          <button
            onClick={() => setCurrentView("booking")}
            className="px-6 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: theme.primary }}
          >
            予約する
          </button>
        </div>
      </div>
      <button
        onClick={() => setCurrentView("menu")}
        className="mt-4 w-full py-3 text-sm text-gray-500 hover:text-gray-700"
      >
        メニューに戻る
      </button>
    </div>
  );

  // Render info
  const renderInfo = () => (
    <div className="p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div
          className="p-6 text-white text-center"
          style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 150%)` }}
        >
          <span className="text-4xl block mb-2">{config.icon}</span>
          <h3 className="text-xl font-bold">{config.name}</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">住所</p>
            <p className="text-sm text-gray-700">{config.address}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">電話番号</p>
            <a href={`tel:${config.phone}`} className="text-sm text-blue-600">{config.phone}</a>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">営業時間</p>
            <p className="text-sm text-gray-700">{config.hours}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">定休日</p>
            <p className="text-sm text-gray-700">{config.closedDays}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">メールアドレス</p>
            <a href={`mailto:${config.email}`} className="text-sm text-blue-600">{config.email}</a>
          </div>
        </div>
      </div>
      <button
        onClick={() => setCurrentView("menu")}
        className="mt-4 w-full py-3 text-sm text-gray-500 hover:text-gray-700"
      >
        メニューに戻る
      </button>
    </div>
  );

  // Loading state
  if (!liffInitialized) {
    return (
      <div className="min-h-screen bg-[#7494C0] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#7494C0] flex flex-col">
      {/* LINE-style Header */}
      <header className="bg-[#4A6DA0] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <Link href="/" className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <p className="font-medium text-sm">{config.name}</p>
          <p className="text-xs text-white/70">
            {isInLiff ? "LINEアプリ内" : "ブラウザモード"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* LIFF Notice */}
      {showLiffNotice && (
        <div className={`px-4 py-2 flex items-center justify-between ${
          liffError === "demo" ? "bg-yellow-400" : liffError ? "bg-red-400" : "bg-green-400"
        }`}>
          <p className={`text-xs ${
            liffError === "demo" ? "text-yellow-900" : liffError ? "text-red-900" : "text-green-900"
          }`}>
            {liffError === "demo"
              ? "デモモード - LIFF IDが未設定です"
              : liffError
              ? liffError
              : isInLiff
              ? "LINE LIFFアプリで開いています"
              : "ブラウザで開いています（デモ）"
            }
          </p>
          <button
            onClick={() => setShowLiffNotice(false)}
            className={liffError === "demo" ? "text-yellow-900" : liffError ? "text-red-900" : "text-green-900"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full">
        {currentView === "menu" && renderMenu()}
        {currentView === "booking" && renderBooking()}
        {currentView === "history" && renderHistory()}
        {currentView === "info" && renderInfo()}
      </main>

      {/* LINE-style Bottom Nav */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2 sticky bottom-0">
        <div className="flex justify-around max-w-lg mx-auto">
          <button
            onClick={() => setCurrentView("menu")}
            className={`flex flex-col items-center py-1 px-3 ${
              currentView === "menu" ? "text-[#06C755]" : "text-gray-400"
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-0.5">ホーム</span>
          </button>
          <button
            onClick={() => setCurrentView("booking")}
            className={`flex flex-col items-center py-1 px-3 ${
              currentView === "booking" ? "text-[#06C755]" : "text-gray-400"
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs mt-0.5">予約</span>
          </button>
          <button
            onClick={() => setCurrentView("history")}
            className={`flex flex-col items-center py-1 px-3 ${
              currentView === "history" ? "text-[#06C755]" : "text-gray-400"
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs mt-0.5">履歴</span>
          </button>
          <button
            onClick={() => setCurrentView("info")}
            className={`flex flex-col items-center py-1 px-3 ${
              currentView === "info" ? "text-[#06C755]" : "text-gray-400"
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs mt-0.5">情報</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
