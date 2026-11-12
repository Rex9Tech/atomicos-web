// src/modules/landing/constants.ts

export const LANDING_DATA = {
  supportEmail: "support@atomicos.io",
} as const;

/**
 * Deep-link scheme registered by the native app (kept in sync with the Android
 * manifest placeholder and the iOS CFBundleURLSchemes entry).
 */
export const APP_DEEP_LINK_SCHEME = "atomic";

/**
 * Store fallback for visitors who do not have the app installed.
 *
 * The Play Store listing is not live yet, so this stays empty and the button
 * falls back to the web auth flow. When the listing ships, drop in the URL —
 * e.g. "https://play.google.com/store/apps/details?id=com.rex9.atomic" —
 * and every "Open the app" CTA picks it up.
 */
export const PLAY_STORE_URL = "";
