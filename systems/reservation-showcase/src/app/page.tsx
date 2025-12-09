"use client";

import Link from "next/link";
import { businessConfigs, lineConfigs, getAllBusinessTypes } from "@/config/businesses";

export default function HomePage() {
  const businessTypes = getAllBusinessTypes();

  // Material Design inspired colors for features
  const features = [
    {
      title: "スマホ対応",
      desc: "どの端末でも快適に",
      color: "#2196F3",
      bgColor: "#E3F2FD",
    },
    {
      title: "予約確認",
      desc: "メールで自動通知",
      color: "#4CAF50",
      bgColor: "#E8F5E9",
    },
    {
      title: "管理機能",
      desc: "予約の一覧管理",
      color: "#FF9800",
      bgColor: "#FFF3E0",
    },
    {
      title: "安心設計",
      desc: "SSL対応・安全",
      color: "#9C27B0",
      bgColor: "#F3E5F5",
    },
    {
      title: "すぐ使える",
      desc: "即日利用可能",
      color: "#F44336",
      bgColor: "#FFEBEE",
    },
    {
      title: "自由設計",
      desc: "業種に合わせて",
      color: "#00BCD4",
      bgColor: "#E0F7FA",
    },
  ];

  const techStack = [
    { name: "Next.js", desc: "React フレームワーク", color: "#000000" },
    { name: "Tailwind", desc: "CSSフレームワーク", color: "#06B6D4" },
    { name: "Supabase", desc: "データベース", color: "#3ECF8E" },
    { name: "TypeScript", desc: "型安全な開発", color: "#3178C6" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header with subtle animation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight animate-fade-in-down">
              予約システム デモ
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm animate-fade-in-up">
              お店の業種に合わせた予約フローをご体験ください
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Demo Notice */}
        <div className="mb-10 animate-fade-in">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-center">
            <p className="text-amber-700 text-sm">
              こちらはデモ環境です。実際の予約は行われません。
            </p>
          </div>
        </div>

        {/* Business Cards */}
        <section className="mb-14">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-700">
              デモを体験する
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              3つの業種からお選びください
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {businessTypes.map((type, index) => {
              const config = businessConfigs[type];
              return (
                <div
                  key={type}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden
                             hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50
                             transition-all duration-300 ease-out transform hover:-translate-y-1
                             animate-fade-in-card"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Card Header with gradient */}
                  <div
                    className="p-6 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${config.theme.primary} 0%, ${config.theme.secondary} 100%)`,
                    }}
                  >
                    {/* Decorative circles */}
                    <div
                      className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20"
                      style={{ backgroundColor: "white" }}
                    />
                    <div
                      className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-10"
                      style={{ backgroundColor: "white" }}
                    />

                    <div className="relative">
                      {/* Material color badge instead of emoji */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3
                                   bg-white/20 backdrop-blur-sm"
                      >
                        <span className="text-2xl">{config.icon}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {config.name}
                      </h3>
                      <p className="text-white/80 text-sm mt-1">
                        {config.theme.name}テーマ
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {config.description}
                    </p>

                    {/* Services as tags */}
                    <div className="mb-5">
                      <div className="flex flex-wrap gap-1.5">
                        {config.services.slice(0, 3).map((s) => (
                          <span
                            key={s.id}
                            className="px-2.5 py-1 text-xs rounded-full transition-colors"
                            style={{
                              backgroundColor: `${config.theme.primary}10`,
                              color: config.theme.primary,
                            }}
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-3">
                      <Link
                        href={`/demo/${type}`}
                        className="flex-1 py-2.5 px-3 text-center text-white rounded-xl text-sm font-medium
                                   transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                        style={{
                          backgroundColor: config.theme.primary,
                          boxShadow: `0 4px 14px ${config.theme.primary}40`,
                        }}
                      >
                        予約ページ
                      </Link>
                      <Link
                        href={`/demo/${type}/admin`}
                        className="flex-1 py-2.5 px-3 text-center rounded-xl text-sm font-medium border-2
                                   transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]"
                        style={{
                          borderColor: config.theme.primary,
                          color: config.theme.primary,
                        }}
                      >
                        管理画面
                      </Link>
                    </div>

                    {/* LINE Button */}
                    <Link
                      href={`/demo/${type}/line`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4
                                 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl text-sm font-medium
                                 transition-all duration-200 active:scale-[0.98]"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 5.82 2 10.5c0 2.55 1.26 4.84 3.24 6.41-.14.51-.9 3.08-.93 3.31 0 0-.02.16.08.22.1.06.22.03.22.03.29-.04 3.37-2.2 3.9-2.57.81.12 1.64.18 2.49.18 5.52 0 10-3.82 10-8.5S17.52 2 12 2z"/>
                      </svg>
                      LINE予約
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* LINE Bot Demo Section */}
        <section className="mb-14 animate-fade-in" style={{ animationDelay: "250ms" }}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-700">
              LINE連携デモ
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              LINEアプリから予約できるLIFF機能をお試しください
            </p>
          </div>

          <div className="bg-[#06C755] rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* LINE Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 5.82 2 10.5c0 2.55 1.26 4.84 3.24 6.41-.14.51-.9 3.08-.93 3.31 0 0-.02.16.08.22.1.06.22.03.22.03.29-.04 3.37-2.2 3.9-2.57.81.12 1.64.18 2.49.18 5.52 0 10-3.82 10-8.5S17.52 2 12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">LINE Bot & LIFF</h3>
                    <p className="text-white/70 text-sm">予約システム連携デモ</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  各業種のLINE公式アカウントを想定したLIFFアプリのデモです。
                  LINEアプリ内で予約フローを体験できます。
                </p>
                <ul className="text-sm text-white/80 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    リッチメニューから予約
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    LINEプロフィール自動入力
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    予約完了通知・リマインド
                  </li>
                </ul>
              </div>

              {/* QR Codes */}
              <div className="flex gap-3 md:gap-4">
                {businessTypes.map((type, typeIndex) => {
                  const config = businessConfigs[type];
                  // Deterministic QR pattern based on type index
                  const qrPattern = [
                    [1,1,1,0,1,1,1, 1,0,1,0,1,0,1, 1,1,1,0,1,1,1, 0,0,0,0,0,0,0, 1,0,1,1,0,1,0, 0,1,0,0,1,0,1, 1,1,1,0,1,1,1],
                    [1,1,1,0,1,1,1, 0,1,0,1,0,1,0, 1,1,1,0,1,1,1, 0,0,0,0,0,0,0, 0,1,0,0,1,0,1, 1,0,1,1,0,1,0, 1,1,1,0,1,1,1],
                    [1,1,1,0,1,1,1, 1,1,0,0,1,1,0, 1,1,1,0,1,1,1, 0,0,0,0,0,0,0, 1,1,0,1,1,0,0, 0,0,1,0,0,1,1, 1,1,1,0,1,1,1],
                  ][typeIndex];
                  return (
                    <Link
                      key={type}
                      href={`/demo/${type}/line`}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="bg-white rounded-xl p-3 shadow-lg group-hover:shadow-xl transition-shadow">
                        {/* QR Code placeholder - in real app, generate actual QR */}
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
                          {/* QR Pattern */}
                          <div className="absolute inset-2 grid grid-cols-7 gap-0.5">
                            {qrPattern.map((filled, i) => (
                              <div
                                key={i}
                                className={`rounded-sm ${
                                  filled ? "bg-slate-800" : "bg-white"
                                }`}
                              />
                            ))}
                          </div>
                          {/* Center icon */}
                          <div
                            className="absolute w-8 h-8 rounded-lg flex items-center justify-center z-10"
                            style={{ backgroundColor: config.theme.primary }}
                          >
                            <span className="text-sm">{config.icon}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-white/90 font-medium text-center">
                        {config.type === "salon" && "サロン"}
                        {config.type === "clinic" && "クリニック"}
                        {config.type === "restaurant" && "レストラン"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-14">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-700">主な機能</h2>
            <p className="text-slate-400 text-sm mt-1">
              シンプルで使いやすい設計
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-slate-100 p-4
                           hover:shadow-md transition-all duration-200
                           animate-fade-in-card"
                style={{
                  animationDelay: `${(index + 3) * 80}ms`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: feature.color }}
                  />
                </div>
                <h3 className="font-medium text-slate-800 text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Stack */}
        <section className="mb-10">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-700">使用技術</h2>
            <p className="text-slate-400 text-sm mt-1">
              モダンな技術スタックで構築
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {techStack.map((tech, index) => (
                <div
                  key={tech.name}
                  className="text-center p-3 rounded-xl hover:bg-slate-50 transition-colors
                             animate-fade-in-card"
                  style={{ animationDelay: `${(index + 9) * 80}ms` }}
                >
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: tech.color }}
                  />
                  <p className="font-medium text-slate-700 text-sm">
                    {tech.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            予約システムのデモサイトです
          </p>
          <p className="text-slate-300 text-xs mt-2">
            &copy; {new Date().getFullYear()} Reservation Demo
          </p>
        </div>
      </footer>
    </div>
  );
}
