// src/modules/landing/helpers/useOpenApp.ts

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps } from "../../../modules/auth";

/**
 * Returns a callback that opens the AtomicOS app for the current visitor:
 * authenticated users navigate straight to the app home, guests get the
 * in-page auth dialog.
 */
export const useOpenApp = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return () => {
    if (isAuthenticated) {
      navigate(AppRoutes.client.protected.HOME);
    } else {
      navigate(AppRoutes.buildDialogUrl(DialogAuthSteps.INITIAL));
    }
  };
};

export default useOpenApp;
