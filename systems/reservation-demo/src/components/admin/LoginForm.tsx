"use client";

import { useState } from "react";
import { businessConfig } from "@/lib/config";
import Button from "../common/Button";

interface LoginFormProps {
  onLogin: (success: boolean) => void;
}

// MVP credentials - hardcoded for demo
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store auth in sessionStorage for MVP
      sessionStorage.setItem("admin_authenticated", "true");
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
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: businessConfig.theme.primary }}
          >
            管理画面ログイン
          </h1>
          <p className="text-gray-600 text-sm">{businessConfig.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ユーザー名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              placeholder="ユーザー名を入力"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              placeholder="パスワードを入力"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
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
