// src/modules/landing/helpers/nativeApp.helper.ts

import { APP_DEEP_LINK_SCHEME, PLAY_STORE_URL } from "../constants";

export type MobilePlatform = "android" | "ios";

/** Detect a phone/tablet browser so desktop keeps the plain web flow. */
export const detectMobilePlatform = (): MobilePlatform | null => {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent ?? "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  // iPadOS 13+ reports itself as a Mac; touch points give it away.
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
    return "ios";
  }
  return null;
};

/** How long iOS gets to switch to the app before we fall back. */
export const HANDOFF_TIMEOUT_MS = 1200;

export interface OpenNativeAppOptions {
  /** Visited when the app never opened and no store URL is configured. */
  onFallback?: () => void;
  /** Absolute URL used when the handoff fails (defaults to the current page). */
  fallbackUrl?: string;
  /** Overrides PLAY_STORE_URL (mainly for tests). */
  storeUrl?: string;
}

/**
 * Hand a visitor off to the installed native app.
 *
 * Android goes through a Chrome `intent://` handoff which opens the app when a
 * handler is installed and cleanly follows `browser_fallback_url` otherwise.
 * iOS (Safari has no equivalent) tries the scheme and falls back on a timer —
 * the app opening hides the page, which cancels the timer, so the fallback
 * only fires when the app really is missing.
 */
export const openNativeApp = (
  platform: MobilePlatform,
  options: OpenNativeAppOptions = {}
): void => {
  if (typeof window === "undefined") return;

  const storeUrl = options.storeUrl ?? PLAY_STORE_URL;
  const fallbackUrl = options.fallbackUrl ?? window.location.href;

  if (platform === "android") {
    const browserFallback = storeUrl || fallbackUrl;
    const intent =
      `intent://#Intent;scheme=${APP_DEEP_LINK_SCHEME}` +
      `;S.browser_fallback_url=${encodeURIComponent(browserFallback)};end`;
    window.location.href = intent;
    return;
  }

  // iOS: no intent handoff — try the scheme, redirect on a timer.
  const timer = window.setTimeout(() => {
    if (storeUrl) {
      window.location.href = storeUrl;
    } else {
      options.onFallback?.();
    }
  }, HANDOFF_TIMEOUT_MS);

  const cancel = () => window.clearTimeout(timer);
  window.addEventListener("pagehide", cancel, { once: true });
  if (typeof document !== "undefined") {
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) cancel();
      },
      { once: true }
    );
  }

  window.location.href = `${APP_DEEP_LINK_SCHEME}://`;
};
