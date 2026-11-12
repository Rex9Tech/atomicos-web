// src/modules/landing/helpers/useOpenApp.ts

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps } from "../../../modules/auth";
import { detectMobilePlatform, openNativeApp } from "./nativeApp.helper";

/**
 * Returns a callback that opens AtomicOS for the current visitor:
 * - phones/tablets: hand off to the installed native app, falling back to the
 *   store listing (once its URL is configured) or the in-page auth flow;
 * - desktop: authenticated users navigate straight to the app home, guests
 *   get the in-page auth dialog.
 */
export const useOpenApp = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return () => {
    const dialogPath = AppRoutes.buildDialogUrl(DialogAuthSteps.INITIAL);
    const platform = detectMobilePlatform();

    if (platform) {
      openNativeApp(platform, {
        fallbackUrl: new URL(dialogPath, window.location.origin).toString(),
        onFallback: () => navigate(dialogPath),
      });
      return;
    }

    if (isAuthenticated) {
      navigate(AppRoutes.client.protected.HOME);
    } else {
      navigate(dialogPath);
    }
  };
};

export default useOpenApp;
