"use client";

import { businessConfig } from "@/lib/config";

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function Header({ showBackButton, onBack }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="戻る"
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
                <span className="text-sm">戻る</span>
              </button>
            )}
            <h1
              className="text-lg md:text-xl font-bold"
              style={{ color: businessConfig.theme.primary }}
            >
              {businessConfig.name}
            </h1>
          </div>
          <a
            href={`tel:${businessConfig.phone}`}
            className="flex items-center gap-2 text-sm md:text-base font-medium hover:opacity-80 transition-opacity"
            style={{ color: businessConfig.theme.primary }}
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="hidden sm:inline">{businessConfig.phone}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
