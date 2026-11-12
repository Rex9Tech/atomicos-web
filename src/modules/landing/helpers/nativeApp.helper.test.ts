import { describe, it, expect, afterEach, vi } from "vitest";
import {
  detectMobilePlatform,
  openNativeApp,
  HANDOFF_TIMEOUT_MS,
} from "./nativeApp.helper";

interface FakeWindow {
  location: { href: string };
  setTimeout: (cb: () => void, ms: number) => number;
  clearTimeout: (id: number) => void;
  addEventListener: () => void;
}

const installFakeWindow = () => {
  const win: FakeWindow = {
    location: { href: "https://atomicos.io/" },
    // Delegate to the global timers so vi.useFakeTimers() controls them.
    setTimeout: (cb, ms) =>
      globalThis.setTimeout(cb, ms) as unknown as number,
    clearTimeout: (id) =>
      globalThis.clearTimeout(id as unknown as Parameters<typeof clearTimeout>[0]),
    addEventListener: () => undefined,
  };
  Object.defineProperty(globalThis, "window", {
    value: win,
    configurable: true,
    writable: true,
  });
  return win;
};

const mockUserAgent = (ua: string, platform = "", maxTouchPoints = 0) => {
  Object.defineProperty(globalThis, "navigator", {
    value: { userAgent: ua, platform, maxTouchPoints },
    configurable: true,
    writable: true,
  });
};

const clearGlobals = () => {
  try {
    delete (globalThis as unknown as Record<string, unknown>).window;
  } catch {
    Object.defineProperty(globalThis, "window", {
      value: undefined,
      configurable: true,
    });
  }
  try {
    delete (globalThis as unknown as Record<string, unknown>).navigator;
  } catch {
    Object.defineProperty(globalThis, "navigator", {
      value: undefined,
      configurable: true,
    });
  }
};

describe("nativeApp.helper", () => {
  afterEach(() => {
    clearGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("detects Android and iOS user agents", () => {
    mockUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8)");
    expect(detectMobilePlatform()).toBe("android");

    mockUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");
    expect(detectMobilePlatform()).toBe("ios");
  });

  it("treats touch-capable MacIntel (iPadOS) as iOS", () => {
    mockUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)", "MacIntel", 5);
    expect(detectMobilePlatform()).toBe("ios");
  });

  it("returns null on desktop browsers", () => {
    mockUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    expect(detectMobilePlatform()).toBeNull();
  });

  it("hands Android off through an intent with a browser fallback URL", () => {
    const win = installFakeWindow();
    openNativeApp("android", {
      fallbackUrl: "https://atomicos.io/dialog/auth",
    });

    expect(win.location.href).toContain("intent://#Intent;scheme=atomic");
    expect(win.location.href).toContain(
      `S.browser_fallback_url=${encodeURIComponent("https://atomicos.io/dialog/auth")}`
    );
  });

  it("prefers the store URL as the Android fallback when configured", () => {
    const win = installFakeWindow();
    const store = "https://play.google.com/store/apps/details?id=com.rex9.atomic";
    openNativeApp("android", { storeUrl: store });

    expect(win.location.href).toContain(
      `S.browser_fallback_url=${encodeURIComponent(store)}`
    );
  });

  it("redirects iOS to the store after the handoff timeout", () => {
    vi.useFakeTimers();
    const win = installFakeWindow();
    const store = "https://play.google.com/store/apps/details?id=com.rex9.atomic";

    openNativeApp("ios", { storeUrl: store });
    // Scheme attempt happens immediately.
    expect(win.location.href).toBe("atomic://");

    vi.advanceTimersByTime(HANDOFF_TIMEOUT_MS);
    expect(win.location.href).toBe(store);
  });

  it("invokes onFallback on iOS when no store URL is configured", () => {
    vi.useFakeTimers();
    const win = installFakeWindow();
    const onFallback = vi.fn();

    openNativeApp("ios", { onFallback });
    expect(win.location.href).toBe("atomic://");

    vi.advanceTimersByTime(HANDOFF_TIMEOUT_MS);
    expect(onFallback).toHaveBeenCalledTimes(1);
    // No store configured → stay where we are (the callback decides).
    expect(win.location.href).toBe("atomic://");
  });
});
