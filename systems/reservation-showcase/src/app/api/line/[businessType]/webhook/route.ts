import { NextRequest, NextResponse } from "next/server";
import * as line from "@line/bot-sdk";
import { isValidBusinessType } from "@/config/businesses";
import { getLineConfig, getBusinessLineConfig } from "@/config/line";

// LINE Webhook handler for each business type
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ businessType: string }> }
) {
  const { businessType } = await params;

  if (!isValidBusinessType(businessType)) {
    return NextResponse.json({ error: "Invalid business type" }, { status: 400 });
  }

  const lineConfig = getLineConfig(businessType);

  if (!lineConfig.channelAccessToken || !lineConfig.channelSecret) {
    console.error(`LINE credentials not configured for ${businessType}`);
    return NextResponse.json({ error: "LINE not configured" }, { status: 500 });
  }

  const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: lineConfig.channelAccessToken,
  });

  try {
    const body = await request.text();
    const signature = request.headers.get("x-line-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify signature
    if (!line.validateSignature(body, lineConfig.channelSecret, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const events: line.WebhookEvent[] = JSON.parse(body).events;

    // Process events
    await Promise.all(
      events.map(async (event) => {
        await handleEvent(client, event, businessType);
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LINE webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function handleEvent(
  client: line.messagingApi.MessagingApiClient,
  event: line.WebhookEvent,
  businessType: string
) {
  const businessConfig = getBusinessLineConfig(businessType);

  // Handle follow event (user adds friend)
  if (event.type === "follow") {
    const replyToken = event.replyToken;
    if (!replyToken) return;

    await client.replyMessage({
      replyToken,
      messages: [
        {
          type: "text",
          text: `${businessConfig.welcomeMessage}\n\n下のメニューから予約できます。`,
        },
      ],
    });
    return;
  }

  // Handle message event
  if (event.type === "message" && event.message.type === "text") {
    const replyToken = event.replyToken;
    if (!replyToken) return;

    const userMessage = event.message.text.toLowerCase();

    // Handle keywords
    if (userMessage.includes("予約") || userMessage.includes("よやく")) {
      await client.replyMessage({
        replyToken,
        messages: [
          {
            type: "template",
            altText: "予約はこちらから",
            template: {
              type: "buttons",
              title: "ご予約",
              text: "下のボタンから予約ページを開けます",
              actions: [
                {
                  type: "uri",
                  label: "予約する",
                  uri: businessConfig.liffUrl,
                },
              ],
            },
          },
        ],
      });
      return;
    }

    if (userMessage.includes("営業") || userMessage.includes("時間")) {
      await client.replyMessage({
        replyToken,
        messages: [
          {
            type: "text",
            text: `【営業時間】\n${businessConfig.hours}\n\n【定休日】\n${businessConfig.closedDays}`,
          },
        ],
      });
      return;
    }

    if (userMessage.includes("場所") || userMessage.includes("住所") || userMessage.includes("アクセス")) {
      await client.replyMessage({
        replyToken,
        messages: [
          {
            type: "text",
            text: `【住所】\n${businessConfig.address}\n\n【電話番号】\n${businessConfig.phone}`,
          },
        ],
      });
      return;
    }

    // Default response
    await client.replyMessage({
      replyToken,
      messages: [
        {
          type: "text",
          text: "ご質問ありがとうございます。\n\n「予約」→ 予約ページを開く\n「営業時間」→ 営業時間を確認\n「住所」→ 店舗情報を確認\n\nまたは下のメニューからお選びください。",
        },
      ],
    });
  }

  // Handle postback event (from rich menu or buttons)
  if (event.type === "postback") {
    const replyToken = event.replyToken;
    if (!replyToken) return;

    const data = event.postback.data;

    if (data === "action=reserve") {
      await client.replyMessage({
        replyToken,
        messages: [
          {
            type: "template",
            altText: "予約はこちらから",
            template: {
              type: "buttons",
              title: "ご予約",
              text: "予約ページを開いて、日時をお選びください",
              actions: [
                {
                  type: "uri",
                  label: "予約ページを開く",
                  uri: businessConfig.liffUrl,
                },
              ],
            },
          },
        ],
      });
    }

    if (data === "action=check") {
      await client.replyMessage({
        replyToken,
        messages: [
          {
            type: "text",
            text: "予約確認機能は現在準備中です。\nお電話でもご確認いただけます。\n\n" + businessConfig.phone,
          },
        ],
      });
    }

    if (data === "action=info") {
      await client.replyMessage({
        replyToken,
        messages: [
          {
            type: "text",
            text: `【${businessConfig.name}】\n\n【住所】\n${businessConfig.address}\n\n【電話番号】\n${businessConfig.phone}\n\n【営業時間】\n${businessConfig.hours}\n\n【定休日】\n${businessConfig.closedDays}`,
          },
        ],
      });
    }
  }
}

// Verify endpoint for LINE webhook setup
export async function GET() {
  return NextResponse.json({ status: "LINE webhook endpoint ready" });
}
