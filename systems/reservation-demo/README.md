# ビューティーサロン HANA 予約システム

美容サロン向けのオンライン予約システムMVPです。Next.js 14 (App Router) + Tailwind CSS + Supabaseで構築されています。

## 機能

### 顧客向け予約ページ (`/`)
- **Step 1: メニュー選択** - 複数メニューの選択、料金・所要時間表示
- **Step 2: 日時選択** - カレンダーによる日付選択、空き時間スロット表示
- **Step 3: お客様情報入力** - 名前、フリガナ、電話番号、メールアドレス
- **Step 4: 確認画面** - 予約内容の確認、各項目の変更可能
- **Step 5: 完了画面** - 予約番号表示、カレンダーへの追加機能

### 管理画面 (`/admin`)
- **ログイン** - パスワード認証（MVP: admin/admin123）
- **今日の予約** - 本日の予約一覧
- **予約一覧** - 全予約の一覧、日付フィルター
- **カレンダー表示** - 月間カレンダーで予約件数を表示
- **予約詳細** - 予約の詳細表示、ステータス変更（完了/キャンセル）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` を `.env.local` にコピーして、Supabase の認証情報を設定：

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. データベースのセットアップ

Supabase ダッシュボードで `supabase/schema.sql` を実行してテーブルを作成。

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセス。

## デモモード

Supabase が設定されていない場合、アプリケーションはデモモードで動作します：
- 予約データはモックデータを使用
- 予約作成は成功しますがデータベースには保存されません

## ビジネス設定のカスタマイズ

`src/lib/config.ts` を編集して、以下の設定を変更できます：

- サロン名、連絡先情報
- サービスメニュー（名前、料金、所要時間）
- 営業時間、定休日
- 予約可能な時間枠
- テーマカラー

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **言語**: TypeScript

## ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx          # 顧客予約ページ
│   ├── admin/
│   │   └── page.tsx      # 管理画面
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── common/           # 共通コンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   ├── booking/          # 予約フローコンポーネント
│   │   ├── ProgressBar.tsx
│   │   ├── ServiceSelection.tsx
│   │   ├── DateTimeSelection.tsx
│   │   ├── CustomerForm.tsx
│   │   ├── Confirmation.tsx
│   │   └── Completion.tsx
│   └── admin/            # 管理画面コンポーネント
│       ├── LoginForm.tsx
│       ├── ReservationTable.tsx
│       ├── ReservationDetail.tsx
│       └── CalendarView.tsx
└── lib/
    ├── config.ts         # ビジネス設定
    └── supabase.ts       # DB クライアント
```

## 日本語UIの特徴

- 丁寧語（です/ます調）の使用
- 各ステップでの確認機能
- 「戻る」ボタンの常時表示
- 電話番号の目立つ配置
- 営業時間・定休日の明示
- 礼儀正しいエラーメッセージ
- SSL・個人情報保護バッジの表示
