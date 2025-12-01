import Link from "next/link";
import { businessConfigs, getAllBusinessTypes } from "@/config/businesses";

export default function HomePage() {
  const businessTypes = getAllBusinessTypes();

  const features = [
    { icon: "📱", title: "スマホ対応", desc: "レスポンシブデザイン" },
    { icon: "📧", title: "自動通知", desc: "メール確認送信" },
    { icon: "📊", title: "管理画面", desc: "予約一覧・統計" },
    { icon: "🔒", title: "セキュリティ", desc: "SSL暗号化通信" },
    { icon: "⚡", title: "即日対応", desc: "リアルタイム予約" },
    { icon: "🎨", title: "カスタマイズ", desc: "業種別テーマ" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            予約システム デモ一覧
          </h1>
          <p className="text-gray-600 text-center mt-2">
            業種別・デザイン別のデモをご覧いただけます
          </p>
          <p className="text-sm text-orange-600 text-center mt-2 bg-orange-50 py-2 px-4 rounded-lg inline-block mx-auto">
            ※ デモ用サンプルです。実際のご予約はできません。
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Business Cards */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">業種別デモ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {businessTypes.map((type) => {
              const config = businessConfigs[type];
              return (
                <div
                  key={type}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Card Header */}
                  <div
                    className="p-6 text-white"
                    style={{ backgroundColor: config.theme.primary }}
                  >
                    <span className="text-4xl block mb-2">{config.icon}</span>
                    <h3 className="text-xl font-bold">{config.name}</h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">
                      {config.description}
                    </p>

                    {/* Theme Color */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: config.theme.primary }}
                      />
                      <span className="text-sm text-gray-500">
                        テーマ: {config.theme.name}
                      </span>
                    </div>

                    {/* Services Preview */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-1">メニュー例:</p>
                      <p className="text-sm text-gray-600">
                        {config.services.slice(0, 3).map((s) => s.name).join("、")}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/demo/${type}`}
                        className="flex-1 py-2 px-4 text-center text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: config.theme.primary }}
                      >
                        予約ページ
                      </Link>
                      <Link
                        href={`/demo/${type}/admin`}
                        className="flex-1 py-2 px-4 text-center rounded-lg text-sm font-medium border-2 hover:bg-gray-50 transition-colors"
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

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">システム機能</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
              >
                <span className="text-3xl block mb-2">{feature.icon}</span>
                <h3 className="font-medium text-gray-900 text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Stack */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">技術スタック</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="font-medium text-gray-900">Next.js 14</p>
                <p className="text-sm text-gray-500">App Router</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Tailwind CSS</p>
                <p className="text-sm text-gray-500">スタイリング</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Supabase</p>
                <p className="text-sm text-gray-500">データベース</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">TypeScript</p>
                <p className="text-sm text-gray-500">型安全</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm mb-2">
            このデモは技術力をお見せするためのサンプルです
          </p>
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} Reservation System Showcase
          </p>
        </div>
      </footer>
    </div>
  );
}
