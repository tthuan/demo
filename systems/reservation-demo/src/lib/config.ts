// Business configuration - Easy to customize for different businesses
export const businessConfig = {
  name: "ビューティーサロン HANA",
  type: "salon" as const, // salon | clinic | restaurant | hotel
  phone: "03-1234-5678",
  email: "info@salon-hana.jp",
  address: "東京都渋谷区〇〇1-2-3",
  hours: "10:00〜20:00",
  closedDays: "毎週火曜日",
  closedDayNumbers: [2], // 0=Sunday, 1=Monday, 2=Tuesday, etc.

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

  bookingFlow: {
    requirePhone: true,
    requireEmail: true,
    confirmationMethod: "email" as const, // email | sms | both
    cancellationPolicy: "前日までにご連絡ください",
  },

  theme: {
    primary: "#be185d", // Rose for salon
    secondary: "#fce7f3",
  },
};

// Type definitions
export type Service = (typeof businessConfig.services)[number];
export type BusinessType = "salon" | "clinic" | "restaurant" | "hotel";

export interface ReservationData {
  id?: string;
  reservationNumber: string;
  customerName: string;
  customerNameKana: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  services: Service[];
  totalDuration: number;
  totalPrice: number;
  notes?: string;
  status: "確定" | "完了" | "キャンセル";
  createdAt?: string;
}

export interface CustomerFormData {
  customerName: string;
  customerNameKana: string;
  phone: string;
  email: string;
  notes: string;
}
