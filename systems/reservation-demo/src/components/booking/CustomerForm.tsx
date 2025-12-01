"use client";

import { useState } from "react";
import { CustomerFormData, businessConfig } from "@/lib/config";
import Button from "../common/Button";

interface CustomerFormProps {
  formData: CustomerFormData;
  onFormChange: (data: CustomerFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

interface FormErrors {
  customerName?: string;
  customerNameKana?: string;
  phone?: string;
  email?: string;
}

export default function CustomerForm({
  formData,
  onFormChange,
  onNext,
  onBack,
}: CustomerFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "恐れ入りますが、お名前をご入力ください";
    }

    if (!formData.customerNameKana.trim()) {
      newErrors.customerNameKana = "恐れ入りますが、フリガナをご入力ください";
    } else if (!/^[ァ-ヶー\s]+$/.test(formData.customerNameKana)) {
      newErrors.customerNameKana =
        "恐れ入りますが、カタカナでご入力ください";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "恐れ入りますが、電話番号をご入力ください";
    } else if (!/^[0-9-]+$/.test(formData.phone)) {
      newErrors.phone = "恐れ入りますが、正しい電話番号をご入力ください";
    }

    if (!formData.email.trim()) {
      newErrors.email = "恐れ入りますが、メールアドレスをご入力ください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "恐れ入りますが、正しいメールアドレスをご入力ください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field change
  const handleChange = (
    field: keyof CustomerFormData,
    value: string
  ) => {
    onFormChange({ ...formData, [field]: value });

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // Handle blur for validation
  const handleBlur = (field: keyof CustomerFormData) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
  };

  // Handle submit
  const handleSubmit = () => {
    setTouched({
      customerName: true,
      customerNameKana: true,
      phone: true,
      email: true,
    });

    if (validateForm()) {
      onNext();
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 ${
      errors[field] && touched[field as string]
        ? "border-red-500 bg-red-50"
        : "border-gray-300 bg-white focus:border-pink-500"
    }`;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          お客様情報入力
        </h2>
        <p className="text-gray-600 text-sm">
          ご予約に必要な情報をご入力ください
        </p>
      </div>

      <div className="space-y-4">
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
            onBlur={() => handleBlur("customerName")}
            placeholder="山田 花子"
            className={inputClass("customerName")}
          />
          {errors.customerName && touched.customerName && (
            <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
          )}
        </div>

        {/* Furigana */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            フリガナ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.customerNameKana}
            onChange={(e) => handleChange("customerNameKana", e.target.value)}
            onBlur={() => handleBlur("customerNameKana")}
            placeholder="ヤマダ ハナコ"
            className={inputClass("customerNameKana")}
          />
          {errors.customerNameKana && touched.customerNameKana && (
            <p className="mt-1 text-sm text-red-500">
              {errors.customerNameKana}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            電話番号 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            placeholder="090-1234-5678"
            className={inputClass("phone")}
          />
          {errors.phone && touched.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="example@email.com"
            className={inputClass("email")}
          />
          {errors.email && touched.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ご要望・備考 <span className="text-gray-400">（任意）</span>
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="ご要望がございましたらご記入ください"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors resize-none"
          />
        </div>
      </div>

      {/* Privacy Policy Link */}
      <div className="text-center">
        <button
          type="button"
          className="text-sm hover:underline"
          style={{ color: businessConfig.theme.primary }}
          onClick={() => alert("個人情報の取り扱いについてのページを表示")}
        >
          個人情報の取り扱いについて
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} fullWidth>
          戻る
        </Button>
        <Button onClick={handleSubmit} fullWidth>
          確認画面へ
        </Button>
      </div>
    </div>
  );
}
