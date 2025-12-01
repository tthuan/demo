-- Reservations table for ビューティーサロン HANA
create table reservations (
  id uuid default gen_random_uuid() primary key,
  reservation_number text unique not null,
  customer_name text not null,
  customer_name_kana text not null,
  phone text not null,
  email text not null,
  date date not null,
  time text not null,
  services jsonb not null, -- [{id, name, duration, price}]
  total_duration int not null,
  total_price int not null,
  notes text,
  status text default '確定', -- 確定, 完了, キャンセル
  created_at timestamp with time zone default now()
);

-- Index for date queries (commonly used for calendar view)
create index idx_reservations_date on reservations(date);

-- Index for status filtering
create index idx_reservations_status on reservations(status);

-- Index for reservation number lookup
create index idx_reservations_number on reservations(reservation_number);

-- Enable Row Level Security (RLS)
alter table reservations enable row level security;

-- Policy to allow all operations for MVP (adjust for production)
create policy "Allow all operations for MVP" on reservations
  for all
  using (true)
  with check (true);
