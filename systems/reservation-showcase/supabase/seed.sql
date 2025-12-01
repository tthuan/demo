-- Seed data for reservation showcase
-- Run after schema.sql

-- =====================
-- SALON reservations
-- =====================
INSERT INTO reservations (business_type, reservation_number, customer_name, customer_name_kana, phone, email, date, time, services, notes, status) VALUES
('salon', 'SALO-20241201-001', '山田 花子', 'ヤマダ ハナコ', '090-1234-5678', 'hanako.yamada@example.com', CURRENT_DATE, '10:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}, {"id": "color", "name": "カラー", "duration": 90, "price": 7700}]', '明るめのカラー希望です', '確定'),
('salon', 'SALO-20241201-002', '佐藤 太郎', 'サトウ タロウ', '080-9876-5432', 'taro.sato@example.com', CURRENT_DATE, '14:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}]', NULL, '確定'),
('salon', 'SALO-20241201-003', '鈴木 美咲', 'スズキ ミサキ', '070-1111-2222', 'misaki.suzuki@example.com', CURRENT_DATE, '16:00', '[{"id": "treatment", "name": "トリートメント", "duration": 30, "price": 3300}]', NULL, '完了'),
('salon', 'SALO-20241202-001', '田中 美咲', 'タナカ ミサキ', '090-3333-4444', 'misaki.tanaka@example.com', CURRENT_DATE + INTERVAL '1 day', '11:00', '[{"id": "perm", "name": "パーマ", "duration": 120, "price": 8800}, {"id": "treatment", "name": "トリートメント", "duration": 30, "price": 3300}]', 'ゆるふわパーマ希望', '確定'),
('salon', 'SALO-20241203-001', '高橋 健太', 'タカハシ ケンタ', '080-5555-6666', 'kenta.takahashi@example.com', CURRENT_DATE + INTERVAL '2 days', '15:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}]', NULL, '確定');

-- =====================
-- CLINIC reservations
-- =====================
INSERT INTO reservations (business_type, reservation_number, customer_name, customer_name_kana, phone, email, date, time, services, insurance_type, notes, status) VALUES
('clinic', 'CLIN-20241201-001', '伊藤 健一', 'イトウ ケンイチ', '090-2222-3333', 'kenichi.ito@example.com', CURRENT_DATE, '9:00', '[{"id": "general", "name": "一般診療", "duration": 15, "price": null}]', '社会保険', '風邪の症状があります', '確定'),
('clinic', 'CLIN-20241201-002', '渡辺 由美', 'ワタナベ ユミ', '080-4444-5555', 'yumi.watanabe@example.com', CURRENT_DATE, '10:30', '[{"id": "checkup", "name": "健康診断", "duration": 60, "price": 11000}]', '国民健康保険', NULL, '確定'),
('clinic', 'CLIN-20241201-003', '中村 雄太', 'ナカムラ ユウタ', '070-6666-7777', 'yuta.nakamura@example.com', CURRENT_DATE, '14:30', '[{"id": "flu", "name": "インフルエンザ予防接種", "duration": 15, "price": 3500}]', '自費', NULL, '完了'),
('clinic', 'CLIN-20241202-001', '小林 恵子', 'コバヤシ ケイコ', '090-8888-9999', 'keiko.kobayashi@example.com', CURRENT_DATE + INTERVAL '1 day', '9:30', '[{"id": "general", "name": "一般診療", "duration": 15, "price": null}]', '後期高齢者', '定期検診', '確定'),
('clinic', 'CLIN-20241203-001', '加藤 誠', 'カトウ マコト', '080-1010-2020', 'makoto.kato@example.com', CURRENT_DATE + INTERVAL '2 days', '11:00', '[{"id": "covid", "name": "コロナワクチン接種", "duration": 15, "price": 0}]', '社会保険', NULL, '確定');

-- =====================
-- RESTAURANT reservations
-- =====================
INSERT INTO reservations (business_type, reservation_number, customer_name, customer_name_kana, phone, email, date, time, services, party_size, seating_preference, occasion, allergies, notes, status) VALUES
('restaurant', 'REST-20241201-001', '木村 誠', 'キムラ マコト', '090-3030-4040', 'makoto.kimura@example.com', CURRENT_DATE, '12:00', '[{"id": "lunch", "name": "ランチコース", "duration": 90, "price": 3300}]', 2, 'テーブル席', 'デート', NULL, NULL, '確定'),
('restaurant', 'REST-20241201-002', '林 株式会社', 'ハヤシ カブシキガイシャ', '03-1234-5678', 'hayashi@company.jp', CURRENT_DATE, '18:30', '[{"id": "premium", "name": "特選コース", "duration": 150, "price": 15000}]', 6, '個室（+¥2,200）', '接待', NULL, '重要なお客様です', '確定'),
('restaurant', 'REST-20241201-003', '吉田 家', 'ヨシダ ケ', '080-5050-6060', 'yoshida.family@example.com', CURRENT_DATE, '11:30', '[{"id": "lunch", "name": "ランチコース", "duration": 90, "price": 3300}]', 4, 'テーブル席', '家族食事', 'えび、かに', NULL, '完了'),
('restaurant', 'REST-20241202-001', '松本 カップル', 'マツモト カップル', '070-7070-8080', 'matsumoto@example.com', CURRENT_DATE + INTERVAL '1 day', '19:00', '[{"id": "dinner", "name": "ディナーコース", "duration": 120, "price": 8800}]', 2, 'カウンター席', '記念日', NULL, '誕生日サプライズあり', '確定'),
('restaurant', 'REST-20241203-001', '井上 グループ', 'イノウエ グループ', '090-9090-0000', 'inoue.group@example.com', CURRENT_DATE + INTERVAL '2 days', '18:00', '[{"id": "kaiseki", "name": "懐石コース", "duration": 180, "price": 22000}]', 8, '個室（+¥2,200）', '会食', 'そば', '同窓会', '確定');

-- Past reservations (history)
INSERT INTO reservations (business_type, reservation_number, customer_name, customer_name_kana, phone, email, date, time, services, status, created_at) VALUES
('salon', 'SALO-20241128-001', '前田 明美', 'マエダ アケミ', '080-1212-3434', 'akemi.maeda@example.com', CURRENT_DATE - INTERVAL '3 days', '10:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}]', '完了', NOW() - INTERVAL '3 days'),
('clinic', 'CLIN-20241128-001', '斎藤 翔', 'サイトウ ショウ', '070-5656-7878', 'sho.saito@example.com', CURRENT_DATE - INTERVAL '3 days', '9:00', '[{"id": "general", "name": "一般診療", "duration": 15, "price": null}]', '完了', NOW() - INTERVAL '3 days'),
('restaurant', 'REST-20241128-001', '岡田 ペア', 'オカダ ペア', '090-9898-0101', 'okada.pair@example.com', CURRENT_DATE - INTERVAL '3 days', '19:00', '[{"id": "dinner", "name": "ディナーコース", "duration": 120, "price": 8800}]', '完了', NOW() - INTERVAL '3 days');
