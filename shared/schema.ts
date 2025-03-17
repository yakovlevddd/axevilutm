import { z } from "zod";

// Regex for valid UTM parameters (alphanumeric, underscore, hyphen)
const utmPattern = /^[a-zA-Z0-9_-]+$/;

// Base URL types
export const appBaseUrls = [
  "https://axevil.app.link/tgac",
  "https://axevil.app.link/tgp",
  "https://axevil.app.link/tgmb",
  "https://axevil.app.link/tgwb",
  "https://axevil.app.link/tgx",
  "https://axevil.app.link/yt",
  "https://axevil.app.link/ytx",
  "https://axevil.app.link/igac",
  "https://axevil.app.link/igex",
  "https://axevil.app.link/ntn",
  "https://axevil.app.link/web",
  "https://axevil.app.link/eml",
  "https://axevil.app.link/pres",
  "https://axevil.app.link/event",
  "https://axevil.app.link/art",
  "https://axevil.app.link/ai",
  "https://axevil.app.link/tc",
] as const;

// Page types for deep linking
export const pageTypes = [
  "idea",
  "portfolio",
  "order",
  "news",
  "profile",
  "assistant",
  "referral",
  "axevil-investments",
] as const;

// Inner page types for portfolio
export const innerPageTypes = ["updates", "rounds", "documents"] as const;

// Schema for app link parameters
export const appLinkSchema = z.object({
  baseUrl: z.enum(appBaseUrls),
  campaign: z
    .string()
    .regex(utmPattern, "Допускаются только буквы, цифры и дефис"),
  feature: z
    .string()
    .regex(utmPattern, "Допускаются только буквы, цифры и дефис")
    .optional(),
  pageType: z.enum(pageTypes).optional(),
  pageId: z.string().optional(),
  initialInnerPage: z.enum(innerPageTypes).optional(),
});

// Обновленная схема для вебинарных ссылок
export const webinarLinkSchema = z.object({
  postfix: z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/, "Допускаются только буквы, цифры и дефис"),
});

export type AppLinkParams = z.infer<typeof appLinkSchema>;
export type WebinarLinkParams = z.infer<typeof webinarLinkSchema>;
