import { BusinessType } from "@/types";
import { businessConfigs } from "./businesses";

// LINE Channel configuration for each business type
// Set these in environment variables
export interface LineChannelConfig {
  channelId: string;
  channelSecret: string;
  channelAccessToken: string;
  liffId: string;
}

export interface BusinessLineConfig {
  name: string;
  welcomeMessage: string;
  liffUrl: string;
  hours: string;
  closedDays: string;
  address: string;
  phone: string;
}

// Get LINE credentials from environment variables
export function getLineConfig(businessType: string): LineChannelConfig {
  const prefix = businessType.toUpperCase();

  return {
    channelId: process.env[`LINE_${prefix}_CHANNEL_ID`] || "",
    channelSecret: process.env[`LINE_${prefix}_CHANNEL_SECRET`] || "",
    channelAccessToken: process.env[`LINE_${prefix}_CHANNEL_ACCESS_TOKEN`] || "",
    liffId: process.env[`LINE_${prefix}_LIFF_ID`] || "",
  };
}

// Get business-specific LINE config
export function getBusinessLineConfig(businessType: string): BusinessLineConfig {
  const config = businessConfigs[businessType as BusinessType];
  const lineConfig = getLineConfig(businessType);

  // Base URL for LIFF - change this to your production domain
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.vercel.app";

  return {
    name: config.name,
    welcomeMessage: getWelcomeMessage(businessType as BusinessType),
    liffUrl: lineConfig.liffId
      ? `https://liff.line.me/${lineConfig.liffId}`
      : `${baseUrl}/demo/${businessType}`,
    hours: config.hours,
    closedDays: config.closedDays,
    address: config.address,
    phone: config.phone,
  };
}

function getWelcomeMessage(type: BusinessType): string {
  switch (type) {
    case "salon":
      return "ビューティーサロン HANAの公式アカウントです✂️\nお友だち追加ありがとうございます！";
    case "clinic":
      return "やまだ内科クリニックの公式アカウントです🏥\nお友だち追加ありがとうございます！";
    case "restaurant":
      return "和食ダイニング 旬彩の公式アカウントです🍽️\nお友だち追加ありがとうございます！";
    default:
      return "お友だち追加ありがとうございます！";
  }
}

// Rich Menu configuration template
export function getRichMenuTemplate(businessType: BusinessType) {
  const config = businessConfigs[businessType];

  return {
    size: {
      width: 2500,
      height: 1686,
    },
    selected: true,
    name: `${config.name} Menu`,
    chatBarText: "メニュー",
    areas: [
      {
        bounds: { x: 0, y: 0, width: 1250, height: 843 },
        action: { type: "postback", data: "action=reserve", displayText: "予約する" },
      },
      {
        bounds: { x: 1250, y: 0, width: 1250, height: 843 },
        action: { type: "postback", data: "action=check", displayText: "予約確認" },
      },
      {
        bounds: { x: 0, y: 843, width: 1250, height: 843 },
        action: { type: "postback", data: "action=info", displayText: "店舗情報" },
      },
      {
        bounds: { x: 1250, y: 843, width: 1250, height: 843 },
        action: { type: "uri", uri: `tel:${config.phone}` },
      },
    ],
  };
}

// LIFF ID mapping for client-side
export const liffIds: Record<BusinessType, string> = {
  salon: process.env.NEXT_PUBLIC_LINE_SALON_LIFF_ID || "",
  clinic: process.env.NEXT_PUBLIC_LINE_CLINIC_LIFF_ID || "",
  restaurant: process.env.NEXT_PUBLIC_LINE_RESTAURANT_LIFF_ID || "",
};
