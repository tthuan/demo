-- Schema for multi-business reservation showcase
-- Supports: salon, clinic, restaurant

-- Drop existing table if exists (for clean setup)
DROP TABLE IF EXISTS reservations;

-- Main reservations table
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_type TEXT NOT NULL,              -- 'salon' | 'clinic' | 'restaurant'
  reservation_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_name_kana TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,

  -- Flexible fields (nullable, used by specific business types)
  services JSONB,                           -- salon, clinic: [{id, name, duration, price}]
  party_size INT,                           -- restaurant: number of guests
  seating_preference TEXT,                  -- restaurant: テーブル席, カウンター席, 個室
  allergies TEXT,                           -- restaurant: food allergies
  insurance_type TEXT,                      -- clinic: 社会保険, 国民健康保険, etc.
  occasion TEXT,                            -- restaurant: 会食, 接待, 記念日, etc.
  notes TEXT,                               -- general notes/requests

  status TEXT DEFAULT '確定',               -- 確定, 完了, キャンセル
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_reservations_business_type ON reservations(business_type);
CREATE INDEX idx_reservations_business_date ON reservations(business_type, date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_number ON reservations(reservation_number);

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations for MVP demo
CREATE POLICY "Allow all operations for demo" ON reservations
  FOR ALL
  USING (true)
  WITH CHECK (true);
