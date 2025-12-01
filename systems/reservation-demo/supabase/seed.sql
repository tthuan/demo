-- Seed data for ビューティーサロン HANA reservation system
-- Run this after schema.sql to populate with sample data

-- Today's reservations
INSERT INTO reservations (reservation_number, customer_name, customer_name_kana, phone, email, date, time, services, total_duration, total_price, notes, status) VALUES
('HANA-20241201-001', '山田 花子', 'ヤマダ ハナコ', '090-1234-5678', 'hanako.yamada@example.com', CURRENT_DATE, '10:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}, {"id": "color", "name": "カラー", "duration": 90, "price": 7700}]', 150, 12100, '明るめのカラー希望です', '確定'),
('HANA-20241201-002', '佐藤 太郎', 'サトウ タロウ', '080-9876-5432', 'taro.sato@example.com', CURRENT_DATE, '14:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}]', 60, 4400, NULL, '確定'),
('HANA-20241201-003', '鈴木 美咲', 'スズキ ミサキ', '070-1111-2222', 'misaki.suzuki@example.com', CURRENT_DATE, '16:00', '[{"id": "treatment", "name": "トリートメント", "duration": 30, "price": 3300}]', 30, 3300, NULL, '完了');

-- Tomorrow's reservations
INSERT INTO reservations (reservation_number, customer_name, customer_name_kana, phone, email, date, time, services, total_duration, total_price, notes, status) VALUES
('HANA-20241202-001', '田中 美咲', 'タナカ ミサキ', '090-3333-4444', 'misaki.tanaka@example.com', CURRENT_DATE + INTERVAL '1 day', '11:00', '[{"id": "perm", "name": "パーマ", "duration": 120, "price": 8800}, {"id": "treatment", "name": "トリートメント", "duration": 30, "price": 3300}]', 150, 12100, 'ゆるふわパーマ希望', '確定'),
('HANA-20241202-002', '高橋 健太', 'タカハシ ケンタ', '080-5555-6666', 'kenta.takahashi@example.com', CURRENT_DATE + INTERVAL '1 day', '15:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}]', 60, 4400, NULL, '確定');

-- Day after tomorrow
INSERT INTO reservations (reservation_number, customer_name, customer_name_kana, phone, email, date, time, services, total_duration, total_price, notes, status) VALUES
('HANA-20241203-001', '伊藤 さくら', 'イトウ サクラ', '070-7777-8888', 'sakura.ito@example.com', CURRENT_DATE + INTERVAL '2 days', '10:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}, {"id": "color", "name": "カラー", "duration": 90, "price": 7700}, {"id": "treatment", "name": "トリートメント", "duration": 30, "price": 3300}]', 180, 15400, '結婚式前なので綺麗にしたいです', '確定'),
('HANA-20241203-002', '渡辺 大輔', 'ワタナベ ダイスケ', '090-9999-0000', 'daisuke.watanabe@example.com', CURRENT_DATE + INTERVAL '2 days', '14:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}]', 60, 4400, NULL, '確定');

-- Next week reservations
INSERT INTO reservations (reservation_number, customer_name, customer_name_kana, phone, email, date, time, services, total_duration, total_price, notes, status) VALUES
('HANA-20241205-001', '中村 愛', 'ナカムラ アイ', '080-1212-3434', 'ai.nakamura@example.com', CURRENT_DATE + INTERVAL '4 days', '11:00', '[{"id": "color", "name": "カラー", "duration": 90, "price": 7700}]', 90, 7700, 'アッシュ系希望', '確定'),
('HANA-20241206-001', '小林 翔', 'コバヤシ ショウ', '070-5656-7878', 'sho.kobayashi@example.com', CURRENT_DATE + INTERVAL '5 days', '17:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}, {"id": "perm", "name": "パーマ", "duration": 120, "price": 8800}]', 180, 13200, NULL, '確定'),
('HANA-20241207-001', '加藤 真由美', 'カトウ マユミ', '090-9090-1010', 'mayumi.kato@example.com', CURRENT_DATE + INTERVAL '6 days', '10:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}, {"id": "treatment", "name": "トリートメント", "duration": 30, "price": 3300}]', 90, 7700, NULL, '確定');

-- Past reservations (for history)
INSERT INTO reservations (reservation_number, customer_name, customer_name_kana, phone, email, date, time, services, total_duration, total_price, notes, status, created_at) VALUES
('HANA-20241128-001', '吉田 明美', 'ヨシダ アケミ', '080-2020-3030', 'akemi.yoshida@example.com', CURRENT_DATE - INTERVAL '3 days', '10:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}, {"id": "color", "name": "カラー", "duration": 90, "price": 7700}]', 150, 12100, NULL, '完了', NOW() - INTERVAL '3 days'),
('HANA-20241128-002', '松本 拓也', 'マツモト タクヤ', '070-4040-5050', 'takuya.matsumoto@example.com', CURRENT_DATE - INTERVAL '3 days', '15:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}]', 60, 4400, NULL, '完了', NOW() - INTERVAL '3 days'),
('HANA-20241129-001', '井上 優子', 'イノウエ ユウコ', '090-6060-7070', 'yuko.inoue@example.com', CURRENT_DATE - INTERVAL '2 days', '11:00', '[{"id": "perm", "name": "パーマ", "duration": 120, "price": 8800}]', 120, 8800, NULL, '完了', NOW() - INTERVAL '2 days'),
('HANA-20241129-002', '木村 隆', 'キムラ タカシ', '080-8080-9090', 'takashi.kimura@example.com', CURRENT_DATE - INTERVAL '2 days', '14:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}]', 60, 4400, NULL, 'キャンセル', NOW() - INTERVAL '2 days'),
('HANA-20241130-001', '林 恵子', 'ハヤシ ケイコ', '070-1010-2020', 'keiko.hayashi@example.com', CURRENT_DATE - INTERVAL '1 day', '10:00', '[{"id": "cut", "name": "カット", "duration": 60, "price": 4400}, {"id": "treatment", "name": "トリートメント", "duration": 30, "price": 3300}]', 90, 7700, NULL, '完了', NOW() - INTERVAL '1 day');
