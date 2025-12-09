# LINE Bot & LIFF Setup Guide

This document explains how to set up LINE Bot for the reservation system.

## Overview

Create individual LINE Official Accounts for each business type (salon, clinic, restaurant) and configure Messaging API and LIFF.

## Step 1: Create Provider in LINE Developers Console

1. Go to [LINE Developers](https://developers.line.biz/)
2. Log in with your LINE account
3. Click "Providers" → "Create"
4. Enter provider name (e.g., `Reservation System Demo`)

## Step 2: Create Messaging API Channels (Create 3)

Create a channel for each business type:

### Salon Channel
1. Inside provider, click "Create Channel" → Select "Messaging API"
2. Enter required information:
   - Channel name: `Beauty Salon HANA`
   - Channel description: `Beauty salon reservation`
   - Category: `Beauty`
   - Subcategory: `Hair salon`
3. After creation, go to "Messaging API" tab

### Clinic Channel
- Channel name: `Yamada Internal Medicine Clinic`
- Category: `Medical`
- Subcategory: `Clinic`

### Restaurant Channel
- Channel name: `Japanese Dining Shunsai`
- Category: `Food & Beverage`
- Subcategory: `Restaurant`

## Step 3: Get Channel Access Token

For each channel:

1. Open "Messaging API" tab
2. In "Channel access token" section, click "Issue"
3. Copy and save the token

```
LINE_SALON_CHANNEL_ACCESS_TOKEN=xxxxxxxx
LINE_CLINIC_CHANNEL_ACCESS_TOKEN=xxxxxxxx
LINE_RESTAURANT_CHANNEL_ACCESS_TOKEN=xxxxxxxx
```

## Step 4: Get Channel Secret

For each channel:

1. Open "Basic settings" tab
2. Copy "Channel secret"

```
LINE_SALON_CHANNEL_SECRET=xxxxxxxx
LINE_CLINIC_CHANNEL_SECRET=xxxxxxxx
LINE_RESTAURANT_CHANNEL_SECRET=xxxxxxxx
```

## Step 5: Set Webhook URL

For each channel:

1. Open "Messaging API" tab
2. Set "Webhook URL" to:

```
Salon:      https://your-domain.vercel.app/api/line/salon/webhook
Clinic:     https://your-domain.vercel.app/api/line/clinic/webhook
Restaurant: https://your-domain.vercel.app/api/line/restaurant/webhook
```

3. Turn ON "Use webhook"
4. Click "Verify" button to test (200 OK means success)

## Step 6: Create LIFF App

For each channel:

1. Open "LIFF" tab
2. Click "Add"
3. Configure:

| Item | Value |
|------|-------|
| LIFF app name | `Reservation Page` |
| Size | `Full` |
| Endpoint URL | `https://your-domain.vercel.app/demo/salon/line` |
| Scope | Check `profile` |
| Bot link feature | `On (Aggressive)` |

4. After creation, copy the LIFF ID

```
NEXT_PUBLIC_LINE_SALON_LIFF_ID=1234567890-xxxxxxxx
NEXT_PUBLIC_LINE_CLINIC_LIFF_ID=1234567891-xxxxxxxx
NEXT_PUBLIC_LINE_RESTAURANT_LIFF_ID=1234567892-xxxxxxxx
```

## Step 7: Response Settings

For each channel:

1. Click "LINE Official Account settings" → "Response settings"
2. Configure:

| Item | Value |
|------|-------|
| Response message | OFF |
| Greeting message | OFF (handled by Webhook) |
| Webhook | ON |

## Step 8: Create Rich Menu (Optional)

In LINE Official Account Manager:

1. Go to [LINE Official Account Manager](https://manager.line.biz/)
2. Select the account
3. "Rich menu" → "Create"

### Layout Example (2x2 Grid)

```
┌─────────────┬─────────────┐
│   Reserve   │    Check    │
│ (action=    │ (action=    │
│  reserve)   │  check)     │
├─────────────┼─────────────┤
│ Store Info  │    Call     │
│ (action=    │ (tel:       │
│  info)      │  03-xxxx)   │
└─────────────┴─────────────┘
```

### Action Settings

| Button | Type | Value |
|--------|------|-------|
| Reserve | Postback | `action=reserve` |
| Check Reservation | Postback | `action=check` |
| Store Info | Postback | `action=info` |
| Call | Phone | `03-1234-5678` |

## Step 9: Set Environment Variables (Vercel)

1. Go to Vercel project Settings → Environment Variables
2. Add the following:

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

3. Redeploy

## Step 10: Test

1. Scan QR code in LINE app (get from LINE Official Account Manager)
2. Add as friend
3. Check if welcome message arrives
4. Type "予約" (reserve) and check if booking button appears
5. Check if rich menu displays

## Troubleshooting

### Webhook verification fails
- Check if Vercel deployment is complete
- Verify URL is correct (don't forget `/webhook` at the end)
- Check if environment variables are set correctly

### LIFF won't initialize
- Verify LIFF ID is correct
- Check endpoint URL is correct
- Ensure using HTTPS

### Can't get profile
- Check if `profile` is checked in LIFF Scope settings
- Verify user is logged in

## Get QR Code

Download QR codes from "Add friend guide" in LINE Official Account Manager.

For the demo site, place QR code images in `/public/line-qr/`:
- `/public/line-qr/salon.png`
- `/public/line-qr/clinic.png`
- `/public/line-qr/restaurant.png`

## Reference Links

- [LINE Developers Documentation](https://developers.line.biz/en/docs/)
- [Messaging API Reference](https://developers.line.biz/en/reference/messaging-api/)
- [LIFF v2 Documentation](https://developers.line.biz/en/docs/liff/)
- [LINE Official Account Manager](https://manager.line.biz/)
