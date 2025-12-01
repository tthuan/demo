import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ReservationData, Service } from "./config";

// Supabase configuration - Replace with your project credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create client only if configured, otherwise create a mock client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface DbReservation {
  id: string;
  reservation_number: string;
  customer_name: string;
  customer_name_kana: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  services: Service[];
  total_duration: number;
  total_price: number;
  notes: string | null;
  status: string;
  created_at: string;
}

// Convert database reservation to app format
export function dbToReservation(db: DbReservation): ReservationData {
  return {
    id: db.id,
    reservationNumber: db.reservation_number,
    customerName: db.customer_name,
    customerNameKana: db.customer_name_kana,
    phone: db.phone,
    email: db.email,
    date: db.date,
    time: db.time,
    services: db.services,
    totalDuration: db.total_duration,
    totalPrice: db.total_price,
    notes: db.notes || undefined,
    status: db.status as ReservationData["status"],
    createdAt: db.created_at,
  };
}

// Generate unique reservation number
export function generateReservationNumber(date: Date): string {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `HANA-${dateStr}-${random}`;
}

// Create a new reservation
export async function createReservation(
  data: Omit<ReservationData, "id" | "createdAt">
): Promise<ReservationData | null> {
  if (!supabase) {
    console.log("Supabase not configured, returning null");
    return null;
  }

  const { data: result, error } = await supabase
    .from("reservations")
    .insert({
      reservation_number: data.reservationNumber,
      customer_name: data.customerName,
      customer_name_kana: data.customerNameKana,
      phone: data.phone,
      email: data.email,
      date: data.date,
      time: data.time,
      services: data.services,
      total_duration: data.totalDuration,
      total_price: data.totalPrice,
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

// Get reservations for a specific date
export async function getReservationsByDate(
  date: string
): Promise<ReservationData[]> {
  if (!supabase) {
    console.log("Supabase not configured, returning empty array");
    return [];
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("date", date)
    .order("time");

  if (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }

  return data.map(dbToReservation);
}

// Get all reservations with optional filters
export async function getReservations(filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}): Promise<ReservationData[]> {
  if (!supabase) {
    console.log("Supabase not configured, returning empty array");
    return [];
  }

  let query = supabase.from("reservations").select("*");

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

// Get booked time slots for a specific date
export async function getBookedTimeSlots(date: string): Promise<string[]> {
  if (!supabase) {
    console.log("Supabase not configured, returning empty array");
    return [];
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("time")
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
    console.log("Supabase not configured, returning false");
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

// Get single reservation by ID
export async function getReservationById(
  id: string
): Promise<ReservationData | null> {
  if (!supabase) {
    console.log("Supabase not configured, returning null");
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
