"use client";

import { useState } from "react";
import { BusinessConfig } from "@/types";
import Button from "../common/Button";

interface LoginFormProps {
  config: BusinessConfig;
  onLogin: (success: boolean) => void;
}

// MVP credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export default function LoginForm({ config, onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme } = config;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(`admin_auth_${config.type}`, "true");
      onLogin(true);
    } else {
      setError("恐れ入りますが、ユーザー名またはパスワードが正しくありません");
      onLogin(false);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <span className="text-4xl mb-2 block">{config.icon}</span>
          <h1 className="text-2xl font-bold mb-2" style={{ color: theme.primary }}>
            管理画面ログイン
          </h1>
          <p className="text-gray-600 text-sm">{config.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              style={{ "--tw-ring-color": theme.primary } as React.CSSProperties}
              placeholder="ユーザー名を入力"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              placeholder="パスワードを入力"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg" themeColor={theme.primary}>
            ログイン
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>MVP Demo: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}
