# LINE Bot & LIFF 設定ガイド

このドキュメントでは、LINE Botの設定方法を説明します。

## 概要

各業種（salon, clinic, restaurant）に対して個別のLINE公式アカウントを作成し、Messaging APIとLIFFを設定します。

## Step 1: LINE Developers コンソールでプロバイダー作成

1. [LINE Developers](https://developers.line.biz/) にアクセス
2. LINEアカウントでログイン
3. 「プロバイダー」→「作成」をクリック
4. プロバイダー名を入力（例：`予約システムデモ`）

## Step 2: Messaging API チャンネル作成（3つ作成）

各業種ごとにチャンネルを作成します：

### Salon用チャンネル
1. プロバイダー内で「チャンネル作成」→「Messaging API」を選択
2. 必要情報を入力：
   - チャンネル名: `ビューティーサロン HANA`
   - チャンネル説明: `美容サロンの予約受付`
   - 大業種: `美容`
   - 小業種: `美容室・ヘアサロン`
3. 作成完了後、「Messaging API設定」タブへ

### Clinic用チャンネル
- チャンネル名: `やまだ内科クリニック`
- 大業種: `医療`
- 小業種: `診療所・クリニック`

### Restaurant用チャンネル
- チャンネル名: `和食ダイニング 旬彩`
- 大業種: `飲食`
- 小業種: `レストラン`

## Step 3: チャンネルアクセストークン取得

各チャンネルで：

1. 「Messaging API設定」タブを開く
2. 「チャンネルアクセストークン」セクションで「発行」をクリック
3. トークンをコピーして保存

```
LINE_SALON_CHANNEL_ACCESS_TOKEN=xxxxxxxx
LINE_CLINIC_CHANNEL_ACCESS_TOKEN=xxxxxxxx
LINE_RESTAURANT_CHANNEL_ACCESS_TOKEN=xxxxxxxx
```

## Step 4: チャンネルシークレット取得

各チャンネルで：

1. 「チャンネル基本設定」タブを開く
2. 「チャンネルシークレット」をコピー

```
LINE_SALON_CHANNEL_SECRET=xxxxxxxx
LINE_CLINIC_CHANNEL_SECRET=xxxxxxxx
LINE_RESTAURANT_CHANNEL_SECRET=xxxxxxxx
```

## Step 5: Webhook URL 設定

各チャンネルで：

1. 「Messaging API設定」タブを開く
2. 「Webhook URL」に以下を設定：

```
Salon:      https://your-domain.vercel.app/api/line/salon/webhook
Clinic:     https://your-domain.vercel.app/api/line/clinic/webhook
Restaurant: https://your-domain.vercel.app/api/line/restaurant/webhook
```

3. 「Webhookの利用」をONにする
4. 「検証」ボタンでテスト（200 OKが返れば成功）

## Step 6: LIFF アプリ作成

各チャンネルで：

1. 「LIFF」タブを開く
2. 「追加」をクリック
3. 以下を設定：

| 項目 | 設定値 |
|------|--------|
| LIFFアプリ名 | `予約ページ` |
| サイズ | `Full` |
| エンドポイントURL | `https://your-domain.vercel.app/demo/salon/line` |
| Scope | `profile` にチェック |
| ボットリンク機能 | `On (Aggressive)` |

4. 作成後、LIFF IDをコピー

```
NEXT_PUBLIC_LINE_SALON_LIFF_ID=1234567890-xxxxxxxx
NEXT_PUBLIC_LINE_CLINIC_LIFF_ID=1234567891-xxxxxxxx
NEXT_PUBLIC_LINE_RESTAURANT_LIFF_ID=1234567892-xxxxxxxx
```

## Step 7: 応答設定

各チャンネルで：

1. 「LINE公式アカウント設定」→「応答設定」をクリック
2. 以下を設定：

| 項目 | 設定値 |
|------|--------|
| 応答メッセージ | オフ |
| あいさつメッセージ | オフ（Webhookで処理） |
| Webhook | オン |

## Step 8: リッチメニュー作成（オプション）

LINE Official Account Managerで：

1. [LINE Official Account Manager](https://manager.line.biz/) にアクセス
2. 該当アカウントを選択
3. 「リッチメニュー」→「作成」

### レイアウト例（2x2グリッド）

```
┌─────────────┬─────────────┐
│   予約する   │  予約確認   │
│ (action=    │ (action=    │
│  reserve)   │  check)     │
├─────────────┼─────────────┤
│  店舗情報   │  電話する   │
│ (action=    │ (tel:       │
│  info)      │  03-xxxx)   │
└─────────────┴─────────────┘
```

### アクション設定

| ボタン | タイプ | 値 |
|--------|--------|-----|
| 予約する | ポストバック | `action=reserve` |
| 予約確認 | ポストバック | `action=check` |
| 店舗情報 | ポストバック | `action=info` |
| 電話する | 電話 | `03-1234-5678` |

## Step 9: 環境変数設定（Vercel）

1. Vercelプロジェクトの Settings → Environment Variables
2. 以下を追加：

```bash
# Salon
LINE_SALON_CHANNEL_ID=xxxxx
LINE_SALON_CHANNEL_SECRET=xxxxx
LINE_SALON_CHANNEL_ACCESS_TOKEN=xxxxx
NEXT_PUBLIC_LINE_SALON_LIFF_ID=xxxxx

# Clinic
LINE_CLINIC_CHANNEL_ID=xxxxx
LINE_CLINIC_CHANNEL_SECRET=xxxxx
LINE_CLINIC_CHANNEL_ACCESS_TOKEN=xxxxx
NEXT_PUBLIC_LINE_CLINIC_LIFF_ID=xxxxx

# Restaurant
LINE_RESTAURANT_CHANNEL_ID=xxxxx
LINE_RESTAURANT_CHANNEL_SECRET=xxxxx
LINE_RESTAURANT_CHANNEL_ACCESS_TOKEN=xxxxx
NEXT_PUBLIC_LINE_RESTAURANT_LIFF_ID=xxxxx

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

3. 再デプロイ

## Step 10: 動作確認

1. LINEアプリでQRコードをスキャン（LINE Official Account Managerから取得）
2. 友だち追加
3. ウェルカムメッセージが届くか確認
4. 「予約」と入力して予約ボタンが表示されるか確認
5. リッチメニューが表示されるか確認

## トラブルシューティング

### Webhook検証が失敗する
- Vercelデプロイが完了しているか確認
- URLが正しいか確認（末尾の`/webhook`を忘れずに）
- 環境変数が正しく設定されているか確認

### LIFFが初期化できない
- LIFF IDが正しいか確認
- エンドポイントURLが正しいか確認
- HTTPSであることを確認

### プロフィール取得できない
- LIFFのScopeで`profile`にチェックが入っているか確認
- ユーザーがログインしているか確認

## QRコード取得

LINE Official Account Managerの「友だち追加ガイド」からQRコードをダウンロードできます。

デモサイトでは、このQRコード画像を`/public/line-qr/`に配置して表示できます：
- `/public/line-qr/salon.png`
- `/public/line-qr/clinic.png`
- `/public/line-qr/restaurant.png`

## 参考リンク

- [LINE Developers ドキュメント](https://developers.line.biz/ja/docs/)
- [Messaging API リファレンス](https://developers.line.biz/ja/reference/messaging-api/)
- [LIFF v2 ドキュメント](https://developers.line.biz/ja/docs/liff/)
- [LINE Official Account Manager](https://manager.line.biz/)
