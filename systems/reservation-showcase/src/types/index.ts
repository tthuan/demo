// Business types supported in the showcase
export type BusinessType = "salon" | "clinic" | "restaurant";

// Service/menu item definition
export interface Service {
  id: string;
  name: string;
  duration: number; // minutes
  price: number | null; // null for services like "general consultation"
}

// Theme configuration
export interface ThemeConfig {
  primary: string;
  secondary: string;
  name: string;
}

// Time slots configuration - can be array or object for different periods
export type TimeSlots = string[] | { lunch: string[]; dinner: string[] };

// Form field types
export type FormField =
  | "name"
  | "nameKana"
  | "phone"
  | "email"
  | "notes"
  | "birthdate"
  | "insuranceType"
  | "partySize"
  | "seating"
  | "allergies"
  | "occasion";

// Business configuration
export interface BusinessConfig {
  name: string;
  type: BusinessType;
  icon: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  closedDays: string;
  closedDayNumbers: number[]; // 0=Sunday, 1=Monday, etc.
  services: Service[];
  timeSlots: TimeSlots;
  formFields: FormField[];
  theme: ThemeConfig;
  // Optional fields for specific business types
  insuranceTypes?: string[];
  partySizes?: number[];
  seatingOptions?: string[];
  occasions?: string[];
}

// Customer form data
export interface CustomerFormData {
  name: string;
  nameKana: string;
  phone: string;
  email: string;
  notes: string;
  // Optional fields
  birthdate?: string;
  insuranceType?: string;
  partySize?: number;
  seating?: string;
  allergies?: string;
  occasion?: string;
}

// Reservation data
export interface ReservationData {
  id?: string;
  businessType: BusinessType;
  reservationNumber: string;
  customerName: string;
  customerNameKana: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  services?: Service[];
  partySize?: number;
  seatingPreference?: string;
  allergies?: string;
  insuranceType?: string;
  occasion?: string;
  notes?: string;
  status: "確定" | "完了" | "キャンセル";
  createdAt?: string;
}

// Database reservation type (snake_case)
export interface DbReservation {
  id: string;
  business_type: string;
  reservation_number: string;
  customer_name: string;
  customer_name_kana: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  services: Service[] | null;
  party_size: number | null;
  seating_preference: string | null;
  allergies: string | null;
  insurance_type: string | null;
  occasion: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

// Booking step type
export type BookingStep = 1 | 2 | 3 | 4 | 5;

// Stats for admin dashboard
export interface DashboardStats {
  todayCount: number;
  monthCount: number;
  cancelRate: number;
}
