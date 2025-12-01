"use client";

import { businessConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Business Info */}
        <div className="text-center mb-6">
          <h2
            className="text-lg font-bold mb-2"
            style={{ color: businessConfig.theme.primary }}
          >
            {businessConfig.name}
          </h2>
          <p className="text-gray-600 text-sm mb-1">{businessConfig.address}</p>
          <p className="text-gray-600 text-sm mb-1">
            <span className="font-medium">営業時間：</span>
            {businessConfig.hours}
          </p>
          <p className="text-gray-600 text-sm mb-1">
            <span className="font-medium">定休日：</span>
            {businessConfig.closedDays}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">TEL：</span>
            <a
              href={`tel:${businessConfig.phone}`}
              className="hover:underline"
              style={{ color: businessConfig.theme.primary }}
            >
              {businessConfig.phone}
            </a>
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-xs text-gray-600">SSL暗号化通信</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-xs text-gray-600">個人情報保護</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {businessConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
