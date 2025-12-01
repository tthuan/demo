import { BusinessConfig, BusinessType } from "@/types";

// LINE Bot configurations for demo
export const lineConfigs: Record<BusinessType, { botId: string; liffId: string }> = {
  salon: {
    botId: "@salon-hana-demo",
    liffId: "demo-salon-liff",
  },
  clinic: {
    botId: "@yamada-clinic-demo",
    liffId: "demo-clinic-liff",
  },
  restaurant: {
    botId: "@shunsai-demo",
    liffId: "demo-restaurant-liff",
  },
};

// All business configurations in one file for easy management
export const businessConfigs: Record<BusinessType, BusinessConfig> = {
  salon: {
    name: "ビューティーサロン HANA",
    type: "salon",
    icon: "✂️",
    description: "カット・カラー・パーマなどの予約管理",
    phone: "03-1234-5678",
    email: "info@salon-hana.jp",
    address: "東京都渋谷区〇〇1-2-3",
    hours: "10:00〜20:00",
    closedDays: "毎週火曜日",
    closedDayNumbers: [2], // Tuesday
    services: [
      { id: "cut", name: "カット", duration: 60, price: 4400 },
      { id: "color", name: "カラー", duration: 90, price: 7700 },
      { id: "perm", name: "パーマ", duration: 120, price: 8800 },
      { id: "treatment", name: "トリートメント", duration: 30, price: 3300 },
    ],
    timeSlots: [
      "10:00",
      "11:00",
      "12:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ],
    formFields: ["name", "nameKana", "phone", "email", "notes"],
    theme: { primary: "#be185d", secondary: "#fce7f3", name: "ローズ" },
  },

  clinic: {
    name: "やまだ内科クリニック",
    type: "clinic",
    icon: "🏥",
    description: "診療・健康診断・予防接種の予約管理",
    phone: "03-9876-5432",
    email: "info@yamada-clinic.jp",
    address: "東京都世田谷区〇〇2-3-4",
    hours: "9:00〜12:30 / 14:30〜18:00",
    closedDays: "木曜午後・日曜・祝日",
    closedDayNumbers: [0], // Sunday
    services: [
      { id: "general", name: "一般診療", duration: 15, price: null },
      { id: "checkup", name: "健康診断", duration: 60, price: 11000 },
      { id: "flu", name: "インフルエンザ予防接種", duration: 15, price: 3500 },
      { id: "covid", name: "コロナワクチン接種", duration: 15, price: 0 },
    ],
    timeSlots: [
      "9:00",
      "9:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
    ],
    formFields: [
      "name",
      "nameKana",
      "phone",
      "email",
      "birthdate",
      "insuranceType",
      "notes",
    ],
    insuranceTypes: ["社会保険", "国民健康保険", "後期高齢者", "自費"],
    theme: { primary: "#0d9488", secondary: "#ccfbf1", name: "ティール" },
  },

  restaurant: {
    name: "和食ダイニング 旬彩",
    type: "restaurant",
    icon: "🍽️",
    description: "コース・席・人数を含む予約管理",
    phone: "03-5555-1234",
    email: "reserve@shunsai.jp",
    address: "東京都港区〇〇3-4-5",
    hours: "ランチ 11:30〜14:00 / ディナー 17:30〜22:00",
    closedDays: "毎週月曜日",
    closedDayNumbers: [1], // Monday
    services: [
      { id: "lunch", name: "ランチコース", duration: 90, price: 3300 },
      { id: "dinner", name: "ディナーコース", duration: 120, price: 8800 },
      { id: "premium", name: "特選コース", duration: 150, price: 15000 },
      { id: "kaiseki", name: "懐石コース", duration: 180, price: 22000 },
    ],
    timeSlots: {
      lunch: ["11:30", "12:00", "12:30", "13:00"],
      dinner: ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00"],
    },
    formFields: [
      "name",
      "nameKana",
      "phone",
      "email",
      "partySize",
      "seating",
      "allergies",
      "occasion",
      "notes",
    ],
    partySizes: [1, 2, 3, 4, 5, 6, 7, 8],
    seatingOptions: [
      "テーブル席",
      "カウンター席",
      "個室（+¥2,200）",
      "指定なし",
    ],
    occasions: ["会食", "接待", "記念日", "デート", "家族食事", "その他"],
    theme: { primary: "#92400e", secondary: "#fef3c7", name: "ブラウン" },
  },
};

// Get config by business type
export function getBusinessConfig(type: BusinessType): BusinessConfig {
  return businessConfigs[type];
}

// Get all business types
export function getAllBusinessTypes(): BusinessType[] {
  return Object.keys(businessConfigs) as BusinessType[];
}

// Check if business type is valid
export function isValidBusinessType(type: string): type is BusinessType {
  return type in businessConfigs;
}

// Generate reservation number
export function generateReservationNumber(
  type: BusinessType,
  date: Date
): string {
  const prefix = type.toUpperCase().slice(0, 4);
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${dateStr}-${random}`;
}

// Get time slots as array (handles both array and object formats)
export function getTimeSlotsArray(
  config: BusinessConfig,
  selectedService?: string
): string[] {
  const slots = config.timeSlots;

  if (Array.isArray(slots)) {
    return slots;
  }

  // For restaurant, determine lunch or dinner based on service
  if (selectedService) {
    const isLunch =
      selectedService === "lunch" || selectedService.includes("ランチ");
    return isLunch ? slots.lunch : slots.dinner;
  }

  // Return all slots combined
  return [...slots.lunch, ...slots.dinner];
}
