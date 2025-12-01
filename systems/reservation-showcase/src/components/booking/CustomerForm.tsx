"use client";

import { useState } from "react";
import { BusinessConfig, CustomerFormData } from "@/types";
import Button from "../common/Button";

interface CustomerFormProps {
  config: BusinessConfig;
  formData: CustomerFormData;
  onFormChange: (data: CustomerFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

interface FormErrors {
  [key: string]: string | undefined;
}

export default function CustomerForm({
  config,
  formData,
  onFormChange,
  onNext,
  onBack,
}: CustomerFormProps) {
  const { theme, formFields, insuranceTypes, partySizes, seatingOptions, occasions } = config;
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formFields.includes("name") && !formData.name.trim()) {
      newErrors.name = "恐れ入りますが、お名前をご入力ください";
    }

    if (formFields.includes("nameKana") && !formData.nameKana.trim()) {
      newErrors.nameKana = "恐れ入りますが、フリガナをご入力ください";
    } else if (formFields.includes("nameKana") && !/^[ァ-ヶー\s]+$/.test(formData.nameKana)) {
      newErrors.nameKana = "恐れ入りますが、カタカナでご入力ください";
    }

    if (formFields.includes("phone") && !formData.phone.trim()) {
      newErrors.phone = "恐れ入りますが、電話番号をご入力ください";
    } else if (formFields.includes("phone") && !/^[0-9-]+$/.test(formData.phone)) {
      newErrors.phone = "恐れ入りますが、正しい電話番号をご入力ください";
    }

    if (formFields.includes("email") && !formData.email.trim()) {
      newErrors.email = "恐れ入りますが、メールアドレスをご入力ください";
    } else if (formFields.includes("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "恐れ入りますが、正しいメールアドレスをご入力ください";
    }

    if (formFields.includes("partySize") && !formData.partySize) {
      newErrors.partySize = "恐れ入りますが、人数をお選びください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CustomerFormData, value: string | number) => {
    onFormChange({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
  };

  const handleSubmit = () => {
    const allTouched: Record<string, boolean> = {};
    formFields.forEach((f) => (allTouched[f] = true));
    setTouched(allTouched);
    if (validateForm()) onNext();
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
      errors[field] && touched[field]
        ? "border-red-500 bg-red-50 focus:ring-red-500"
        : "border-gray-300 bg-white focus:ring-opacity-50"
    }`;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">お客様情報入力</h2>
        <p className="text-gray-600 text-sm">ご予約に必要な情報をご入力ください</p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        {formFields.includes("name") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="山田 花子"
              className={inputClass("name")}
              style={{ "--tw-ring-color": theme.primary } as React.CSSProperties}
            />
            {errors.name && touched.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
        )}

        {/* Name Kana */}
        {formFields.includes("nameKana") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              フリガナ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nameKana}
              onChange={(e) => handleChange("nameKana", e.target.value)}
              onBlur={() => handleBlur("nameKana")}
              placeholder="ヤマダ ハナコ"
              className={inputClass("nameKana")}
            />
            {errors.nameKana && touched.nameKana && <p className="mt-1 text-sm text-red-500">{errors.nameKana}</p>}
          </div>
        )}

        {/* Phone */}
        {formFields.includes("phone") && (
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
            {errors.phone && touched.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>
        )}

        {/* Email */}
        {formFields.includes("email") && (
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
            {errors.email && touched.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
        )}

        {/* Birthdate (clinic) */}
        {formFields.includes("birthdate") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              生年月日 <span className="text-gray-400">（任意）</span>
            </label>
            <input
              type="date"
              value={formData.birthdate || ""}
              onChange={(e) => handleChange("birthdate", e.target.value)}
              className={inputClass("birthdate")}
            />
          </div>
        )}

        {/* Insurance Type (clinic) */}
        {formFields.includes("insuranceType") && insuranceTypes && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              保険種別 <span className="text-gray-400">（任意）</span>
            </label>
            <select
              value={formData.insuranceType || ""}
              onChange={(e) => handleChange("insuranceType", e.target.value)}
              className={inputClass("insuranceType")}
            >
              <option value="">選択してください</option>
              {insuranceTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {/* Party Size (restaurant) */}
        {formFields.includes("partySize") && partySizes && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              人数 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.partySize || ""}
              onChange={(e) => handleChange("partySize", parseInt(e.target.value))}
              onBlur={() => handleBlur("partySize")}
              className={inputClass("partySize")}
            >
              <option value="">選択してください</option>
              {partySizes.map((size) => (
                <option key={size} value={size}>{size}名</option>
              ))}
            </select>
            {errors.partySize && touched.partySize && <p className="mt-1 text-sm text-red-500">{errors.partySize}</p>}
          </div>
        )}

        {/* Seating (restaurant) */}
        {formFields.includes("seating") && seatingOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              席の希望 <span className="text-gray-400">（任意）</span>
            </label>
            <select
              value={formData.seating || ""}
              onChange={(e) => handleChange("seating", e.target.value)}
              className={inputClass("seating")}
            >
              <option value="">選択してください</option>
              {seatingOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}

        {/* Allergies (restaurant) */}
        {formFields.includes("allergies") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              アレルギー <span className="text-gray-400">（任意）</span>
            </label>
            <input
              type="text"
              value={formData.allergies || ""}
              onChange={(e) => handleChange("allergies", e.target.value)}
              placeholder="例：えび、かに、そば"
              className={inputClass("allergies")}
            />
          </div>
        )}

        {/* Occasion (restaurant) */}
        {formFields.includes("occasion") && occasions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ご利用目的 <span className="text-gray-400">（任意）</span>
            </label>
            <select
              value={formData.occasion || ""}
              onChange={(e) => handleChange("occasion", e.target.value)}
              className={inputClass("occasion")}
            >
              <option value="">選択してください</option>
              {occasions.map((occ) => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>
        )}

        {/* Notes */}
        {formFields.includes("notes") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ご要望・備考 <span className="text-gray-400">（任意）</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="ご要望がございましたらご記入ください"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors resize-none"
            />
          </div>
        )}
      </div>

      {/* Privacy Policy */}
      <div className="text-center">
        <button
          type="button"
          className="text-sm hover:underline"
          style={{ color: theme.primary }}
          onClick={() => alert("個人情報の取り扱いについてのページを表示")}
        >
          個人情報の取り扱いについて
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} fullWidth themeColor={theme.primary}>
          戻る
        </Button>
        <Button onClick={handleSubmit} fullWidth themeColor={theme.primary}>
          確認画面へ
        </Button>
      </div>
    </div>
  );
}
