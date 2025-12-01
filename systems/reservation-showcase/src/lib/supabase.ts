import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  BusinessType,
  DbReservation,
  ReservationData,
  Service,
  DashboardStats,
} from "@/types";

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create client only if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Convert database reservation to app format
export function dbToReservation(db: DbReservation): ReservationData {
  return {
    id: db.id,
    businessType: db.business_type as BusinessType,
    reservationNumber: db.reservation_number,
    customerName: db.customer_name,
    customerNameKana: db.customer_name_kana,
    phone: db.phone,
    email: db.email,
    date: db.date,
    time: db.time,
    services: db.services || undefined,
    partySize: db.party_size || undefined,
    seatingPreference: db.seating_preference || undefined,
    allergies: db.allergies || undefined,
    insuranceType: db.insurance_type || undefined,
    occasion: db.occasion || undefined,
    notes: db.notes || undefined,
    status: db.status as ReservationData["status"],
    createdAt: db.created_at,
  };
}

// Create a new reservation
export async function createReservation(
  data: Omit<ReservationData, "id" | "createdAt">
): Promise<ReservationData | null> {
  if (!supabase) {
    console.log("Supabase not configured");
    return null;
  }

  const { data: result, error } = await supabase
    .from("reservations")
    .insert({
      business_type: data.businessType,
      reservation_number: data.reservationNumber,
      customer_name: data.customerName,
      customer_name_kana: data.customerNameKana,
      phone: data.phone,
      email: data.email,
      date: data.date,
      time: data.time,
      services: data.services || null,
      party_size: data.partySize || null,
      seating_preference: data.seatingPreference || null,
      allergies: data.allergies || null,
      insurance_type: data.insuranceType || null,
      occasion: data.occasion || null,
      notes: data.notes || null,
      status: data.status,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating reservation:", error);
    return null;
  }

  return dbToReservation(result);
}

// Get reservations by business type
export async function getReservations(
  businessType: BusinessType,
  filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }
): Promise<ReservationData[]> {
  if (!supabase) {
    console.log("Supabase not configured");
    return [];
  }

  let query = supabase
    .from("reservations")
    .select("*")
    .eq("business_type", businessType);

  if (filters?.startDate) {
    query = query.gte("date", filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte("date", filters.endDate);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query.order("date").order("time");

  if (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }

  return data.map(dbToReservation);
}

// Get reservations for a specific date
export async function getReservationsByDate(
  businessType: BusinessType,
  date: string
): Promise<ReservationData[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("business_type", businessType)
    .eq("date", date)
    .order("time");

  if (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }

  return data.map(dbToReservation);
}

// Get booked time slots for a date
export async function getBookedTimeSlots(
  businessType: BusinessType,
  date: string
): Promise<string[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("time")
    .eq("business_type", businessType)
    .eq("date", date)
    .neq("status", "キャンセル");

  if (error) {
    console.error("Error fetching booked slots:", error);
    return [];
  }

  return data.map((r) => r.time);
}

// Update reservation status
export async function updateReservationStatus(
  id: string,
  status: ReservationData["status"]
): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating reservation:", error);
    return false;
  }

  return true;
}

// Get dashboard stats
export async function getDashboardStats(
  businessType: BusinessType
): Promise<DashboardStats> {
  if (!supabase) {
    return { todayCount: 0, monthCount: 0, cancelRate: 0 };
  }

  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];

  // Today's count
  const { count: todayCount } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("business_type", businessType)
    .eq("date", today)
    .neq("status", "キャンセル");

  // Month's count
  const { count: monthCount } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("business_type", businessType)
    .gte("date", monthStart)
    .neq("status", "キャンセル");

  // Cancel count this month
  const { count: cancelCount } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("business_type", businessType)
    .gte("date", monthStart)
    .eq("status", "キャンセル");

  // Total this month for cancel rate
  const { count: totalCount } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("business_type", businessType)
    .gte("date", monthStart);

  const cancelRate =
    totalCount && totalCount > 0
      ? Math.round(((cancelCount || 0) / totalCount) * 100)
      : 0;

  return {
    todayCount: todayCount || 0,
    monthCount: monthCount || 0,
    cancelRate,
  };
}

// Get single reservation by ID
export async function getReservationById(
  id: string
): Promise<ReservationData | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching reservation:", error);
    return null;
  }

  return dbToReservation(data);
}
