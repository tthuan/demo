"use client";

import Link from "next/link";
import { businessConfigs, getAllBusinessTypes } from "@/config/businesses";

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
                    <div className="flex gap-2.5">
                      <Link
                        href={`/demo/${type}`}
                        className="flex-1 py-2.5 px-4 text-center text-white rounded-xl text-sm font-medium
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
                        className="flex-1 py-2.5 px-4 text-center rounded-xl text-sm font-medium border-2
                                   transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]"
                        style={{
                          borderColor: config.theme.primary,
                          color: config.theme.primary,
                        }}
                      >
                        管理画面
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Admin Login Info - New Section */}
        <section className="mb-14 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="bg-slate-800 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">管理画面ログイン情報</h3>
                <p className="text-slate-400 text-sm mb-4">
                  各業種の管理画面にログインして、予約管理機能をお試しください
                </p>
                <div className="bg-slate-700/50 rounded-xl p-4 font-mono text-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-slate-400 w-24">ユーザー名</span>
                    <span className="text-emerald-400 font-medium">admin</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 w-24">パスワード</span>
                    <span className="text-emerald-400 font-medium">admin123</span>
                  </div>
                </div>
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
