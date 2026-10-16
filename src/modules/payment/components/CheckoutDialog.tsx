import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "../../../design/components/overlay";
import { Button, Badge } from "../../../design/components";
import { TextInput } from "../../../design/components/form";
import {
  ButtonVariants,
  BadgeVariants,
  ComponentSizes,
} from "../../../design/constants";
import { iconsLib } from "../../../assets";
import { AppLocales } from "../../../locales/app_locales";
import { IProduct, ICouponValidationResult } from "../types";
import PaymentController from "../payment.controller";
import { useToast } from "../../../contexts/ToastContext";
import { useCountdown } from "../../../hooks";
import QRCode from "qrcode";
import { formatMoney } from "../../../helpers";

interface ICheckoutDialogProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface IMmpayQrState {
  orderId: string;
  qr: string;
  amount: number;
  currency: string;
  expiresAt?: string;
}

const formatCountdown = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export const CheckoutDialog: React.FC<ICheckoutDialogProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { success, error: toastError } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ICouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);

  // Cooldown countdown hook
  const cooldown = useCountdown(0);

  // ===== MyanMyanPay (MMQR) QR phase =====
  const [mmpayQr, setMmpayQr] = useState<IMmpayQrState | null>(null);
  const [qrImage, setQrImage] = useState<string>("");
  const [qrStatus, setQrStatus] = useState<"pending" | "expired" | "failed">(
    "pending",
  );
  const [qrSecondsLeft, setQrSecondsLeft] = useState<number>(0);

  // Reset attempts when cooldown expires
  const prevCooldownActiveRef = useRef(cooldown.isActive);
  useEffect(() => {
    if (prevCooldownActiveRef.current && !cooldown.isActive) {
      setRemainingAttempts(3);
      setCouponError(null);
    }
    prevCooldownActiveRef.current = cooldown.isActive;
  }, [cooldown.isActive]);

  // Reset state when opening with a new product or closing
  useEffect(() => {
    if (isOpen) {
      setCouponCode("");
      setValidationResult(null);
      setCouponError(null);
      setIsSubmitting(false);
      setRemainingAttempts(3);
      setMmpayQr(null);
      setQrImage("");
      setQrStatus("pending");
      setQrSecondsLeft(0);
    }
  }, [isOpen, product?.id]);

  // Render the MMQR payload to a PNG data URL (as-is — never modify the payload)
  useEffect(() => {
    let cancelled = false;
    if (!mmpayQr?.qr) {
      setQrImage("");
      return;
    }
    QRCode.toDataURL(mmpayQr.qr, {
      width: 512,
      margin: 1,
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setQrImage(url);
      })
      .catch(() => {
        /* leave placeholder */
      });
    return () => {
      cancelled = true;
    };
  }, [mmpayQr?.qr]);

  // Countdown to the QR expiry
  useEffect(() => {
    if (!mmpayQr) return;
    const target = mmpayQr.expiresAt
      ? new Date(mmpayQr.expiresAt).getTime()
      : Date.now() + 15 * 60 * 1000;
    const tick = () => {
      const left = Math.max(0, Math.floor((target - Date.now()) / 1000));
      setQrSecondsLeft(left);
      if (left === 0) {
        setQrStatus((s) => (s === "pending" ? "expired" : s));
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [mmpayQr?.orderId, mmpayQr?.expiresAt, mmpayQr]);

  // Poll our backend (updated by the verified webhook) while the QR is pending
  useEffect(() => {
    if (!mmpayQr || qrStatus !== "pending" || !isOpen) return;
    const orderId = mmpayQr.orderId;
    const poll = async () => {
      const res = await PaymentController.getMmpayStatus(orderId);
      if (!res.success) return; // transient failure — try again next tick
      if (res.status === "succeeded") {
        success(t(AppLocales.Payment.CheckoutDialog.MmpayPaid));
        onSuccess();
        onClose();
      } else if (res.status === "failed") {
        setQrStatus("failed");
      } else if (res.status === "expired") {
        setQrStatus("expired");
      }
    };
    const id = window.setInterval(poll, 4000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mmpayQr?.orderId, qrStatus, isOpen]);

  if (!product) return null;

  const handleCouponFailure = (result: {
    error?: string;
    remaining_attempts?: number;
    cooldown_remaining?: number;
  }) => {
    setValidationResult(null);
    if (result.cooldown_remaining && result.cooldown_remaining > 0) {
      const targetTimeMs = Date.now() + result.cooldown_remaining * 1000;
      cooldown.startAt(targetTimeMs);
      setRemainingAttempts(0);
      setCouponError(
        t(AppLocales.Payment.CheckoutDialog.TooManyAttempts, {
          seconds: result.cooldown_remaining,
        }),
      );
    } else if (result.remaining_attempts !== undefined) {
      setRemainingAttempts(result.remaining_attempts);
      setCouponError(
        result.error || t(AppLocales.Payment.CheckoutDialog.InvalidCode),
      );
    } else {
      setCouponError(
        result.error || t(AppLocales.Payment.CheckoutDialog.InvalidCode),
      );
    }
  };

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cooldown.isActive) return;

    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    setIsValidating(true);
    setCouponError(null);

    const result = await PaymentController.validateCoupon(cleanCode, product.id);
    setIsValidating(false);

    if (result.success && result.data) {
      setValidationResult(result.data);
      setCouponError(null);
      setRemainingAttempts(3);
      cooldown.clear();
    } else {
      handleCouponFailure(result);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setValidationResult(null);
    setCouponError(null);
  };

  // ===== MyanMyanPay (MMQR) helpers =====
  const handleMmpayRetry = async () => {
    setMmpayQr(null);
    setQrImage("");
    setQrStatus("pending");
    // Server auto-closes the stale attempt and returns a fresh QR.
    await handleCheckout();
  };

  const downloadQr = () => {
    if (!qrImage || !mmpayQr) return;
    const a = document.createElement("a");
    a.href = qrImage;
    a.download = `atomicos-mmpay-${mmpayQr.orderId}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleCheckout = async () => {
    const cleanCode = couponCode.trim().toUpperCase();
    let appliedCode: string | undefined;

    // If a coupon code is entered, validate before proceeding
    if (cleanCode) {
      if (validationResult?.valid && validationResult.coupon?.code === cleanCode) {
        appliedCode = validationResult.coupon.code;
      } else {
        // Auto-validate unapplied coupon before proceeding to prevent unintended full-price charges
        if (cooldown.isActive) return;

        setIsValidating(true);
        setCouponError(null);

        const valResult = await PaymentController.validateCoupon(
          cleanCode,
          product.id,
        );
        setIsValidating(false);

        if (valResult.success && valResult.data) {
          setValidationResult(valResult.data);
          setRemainingAttempts(3);
          cooldown.clear();
          appliedCode = valResult.data.coupon?.code || cleanCode;
        } else {
          handleCouponFailure(valResult);
          return; // STOP! Halt checkout on invalid coupon so user is not charged full price!
        }
      }
    }

    setIsSubmitting(true);
    const result = await PaymentController.createCheckout(
      product.id,
      appliedCode,
    );
    setIsSubmitting(false);

    if (result.success) {
      if (result.freeAccessGranted) {
        success(t(AppLocales.Payment.CheckoutDialog.FreeClaimed));
        onSuccess();
        onClose();
        return;
      }

      // MyanMyanPay → show the MMQR to scan instead of redirecting.
      if (result.qr && result.orderId) {
        setMmpayQr({
          orderId: result.orderId,
          qr: result.qr,
          amount: result.amount ?? product.unit_amount,
          currency: result.currency || product.currency,
          expiresAt: result.expiresAt,
        });
        setQrStatus("pending");
        return;
      }

      if (result.checkoutUrl) {
        success(t(AppLocales.Payment.CheckoutDialog.Redirecting));
        window.location.assign(result.checkoutUrl);
        return;
      }
    }

    toastError(result.error || t(AppLocales.Payment.Errors.CreateCheckout));
  };

  const isFreeGrant =
    product.free ||
    (validationResult?.valid && validationResult.final_amount === 0);

  const originalPriceDisplay = product.price;
  const finalPriceDisplay =
    validationResult && validationResult.final_amount !== undefined
      ? formatMoney(validationResult.final_amount, validationResult.currency || product.currency)
      : originalPriceDisplay;

  const displayedError = cooldown.isActive
    ? t(AppLocales.Payment.CheckoutDialog.TooManyAttempts, {
        seconds: cooldown.secondsLeft,
      })
    : couponError
    ? remainingAttempts < 3
      ? `${couponError} (${t(AppLocales.Payment.CheckoutDialog.AttemptsRemaining, {
          attempts: remainingAttempts,
        })})`
      : couponError
    : null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t(AppLocales.Payment.CheckoutDialog.Title)}
      className="max-w-lg"
    >
      {mmpayQr ? (
        <div className="space-y-5">
          {/* Summary */}
          <div className="text-center space-y-1">
            <h3 className="font-bold text-lg text-base-content font-primary">
              {product.name}
            </h3>
            <div className="text-3xl font-extrabold text-primary">
              {formatMoney(mmpayQr.amount, mmpayQr.currency)}
            </div>
            <p className="text-xs text-base-content/60">
              {t(AppLocales.Payment.CheckoutDialog.MmpayOrderRef)}:{" "}
              <span className="font-mono">{mmpayQr.orderId}</span>
            </p>
          </div>

          {/* QR code */}
          <div className="flex justify-center">
            <div className="rounded-2xl border-2 border-base-300 bg-white p-4 shadow-sm">
              {qrImage ? (
                <img src={qrImage} alt="MMQR" className="w-56 h-56" />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-base-content/50 text-sm">
                  {t(AppLocales.Payment.CheckoutDialog.MmpayGenerating)}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          {qrStatus === "pending" && (
            <div className="text-center space-y-2">
              <p className="text-body-s text-base-content/70">
                {t(AppLocales.Payment.CheckoutDialog.MmpayScanHint)}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-warning bg-warning/10 border border-warning/30 rounded-full px-3 py-1">
                  ⏳ {t(AppLocales.Payment.CheckoutDialog.MmpayExpiresIn)}{" "}
                  {formatCountdown(qrSecondsLeft)}
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-base-content/70">
                  <span className="loading loading-spinner loading-xs" />
                  {t(AppLocales.Payment.CheckoutDialog.MmpayWaiting)}
                </span>
              </div>
            </div>
          )}

          {qrStatus === "expired" && (
            <div className="text-center space-y-3">
              <p className="text-sm text-error font-medium">
                ⌛ {t(AppLocales.Payment.CheckoutDialog.MmpayExpired)}
              </p>
              <Button
                variant={ButtonVariants.PRIMARY}
                fullWidth
                onClick={handleMmpayRetry}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t(AppLocales.Payment.CheckoutDialog.Processing)
                  : t(AppLocales.Payment.CheckoutDialog.MmpayGetNewQr)}
              </Button>
            </div>
          )}

          {qrStatus === "failed" && (
            <div className="text-center space-y-3">
              <p className="text-sm text-error font-medium">
                ⚠️ {t(AppLocales.Payment.CheckoutDialog.MmpayFailed)}
              </p>
              <Button
                variant={ButtonVariants.PRIMARY}
                fullWidth
                onClick={handleMmpayRetry}
                disabled={isSubmitting}
              >
                {t(AppLocales.Payment.CheckoutDialog.MmpayGetNewQr)}
              </Button>
            </div>
          )}

          {/* Actions */}
          {qrStatus === "pending" && (
            <div className="flex flex-col gap-2 pt-1">
              <Button
                variant={ButtonVariants.SECONDARY}
                fullWidth
                size={ComponentSizes.MD}
                onClick={downloadQr}
                disabled={!qrImage}
              >
                ⬇ {t(AppLocales.Payment.CheckoutDialog.MmpayDownload)}
              </Button>
              <Button
                variant={ButtonVariants.TERTIARY}
                fullWidth
                size={ComponentSizes.SM}
                onClick={onClose}
              >
                {t(AppLocales.Common.Cancel)}
              </Button>
            </div>
          )}

          {/* Compliance footer */}
          <p className="text-center text-xs text-base-content/50">
            {t(AppLocales.Payment.CheckoutDialog.MmpayPoweredBy)}{" "}
            <span className="font-bold tracking-wide text-base-content/70">
              myanmyanpay
            </span>
            <span className="ml-1.5 text-[10px] font-bold border border-base-content/30 rounded px-1 py-0.5 align-middle">
              MMQR
            </span>
          </p>
        </div>
      ) : (
      <div className="space-y-6">
        {/* Product Summary */}
        <div className="bg-base-200/50 rounded-xl p-4 border border-base-300">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-base-content font-primary">
                {product.name}
              </h3>
              <p className="text-body-s text-base-content/70 mt-1">
                {product.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-base-content/60">
                {product.recurring
                  ? `${t(AppLocales.Payment.CheckoutDialog.Per)} ${product.period_label}`
                  : t(AppLocales.Payment.CheckoutDialog.OneTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Promo / Referral Code Input */}
        <div className="space-y-2">
          <label className="text-body-s font-semibold text-base-content flex items-center gap-1.5">
            <iconsLib.tag className="w-4 h-4 text-primary" />
            {t(AppLocales.Payment.CheckoutDialog.PromoCode)}
          </label>

          {validationResult?.valid ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/30">
              <div className="flex items-center gap-2">
                <Badge variant={BadgeVariants.SUCCESS} size={ComponentSizes.MD}>
                  ✓ {validationResult.coupon?.code}
                </Badge>
                <span className="text-xs font-medium text-success">
                  {validationResult.coupon?.title} (
                  {validationResult.coupon?.coupon_type === "percentage"
                    ? `${validationResult.coupon.amount}% ${t(AppLocales.Payment.CheckoutDialog.Off)}`
                    : `${formatMoney(validationResult.coupon?.amount || 0, validationResult.currency || product.currency)} ${t(AppLocales.Payment.CheckoutDialog.Off)}`}
                  )
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-xs text-error hover:underline flex items-center gap-1"
              >
                <iconsLib.close className="w-3.5 h-3.5" />
                {t(AppLocales.Payment.CheckoutDialog.Remove)}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleApplyCoupon}
              className="flex items-center gap-2"
            >
              <div className="flex-1">
                <TextInput
                  placeholder={t(AppLocales.Payment.CheckoutDialog.PromoCodePlaceholder)}
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    if (couponError) setCouponError(null);
                  }}
                  className="font-mono uppercase tracking-wider"
                  disabled={isValidating || isSubmitting || cooldown.isActive}
                />
              </div>
              <Button
                type="submit"
                variant={ButtonVariants.SECONDARY}
                size={ComponentSizes.MD}
                disabled={!couponCode.trim() || isValidating || isSubmitting || cooldown.isActive}
                className="px-5"
              >
                {isValidating
                  ? t(AppLocales.Payment.CheckoutDialog.Checking)
                  : t(AppLocales.Payment.CheckoutDialog.Apply)}
              </Button>
            </form>
          )}

          {displayedError && (
            <p className="text-xs text-error mt-1 flex items-center gap-1">
              <span>⚠️</span> {displayedError}
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-base-300 pt-4 space-y-2">
          <div className="flex justify-between text-body-s text-base-content/70">
            <span>{t(AppLocales.Payment.CheckoutDialog.Subtotal)}</span>
            <span className={validationResult?.valid ? "line-through opacity-60" : ""}>
              {originalPriceDisplay}
            </span>
          </div>

          {validationResult?.valid && (
            <div className="flex justify-between text-body-s text-success font-medium">
              <span>
                {t(AppLocales.Payment.CheckoutDialog.Discount)} (
                {validationResult.coupon?.code}
                )
              </span>
              <span>
                -
                {formatMoney(
                  validationResult.discount_amount || 0,
                  validationResult.currency || product.currency,
                )}
              </span>
            </div>
          )}

          <div className="border-t border-base-300 pt-2 flex justify-between items-baseline">
            <span className="font-bold text-base text-base-content">
              {t(AppLocales.Payment.CheckoutDialog.TotalDueToday)}
            </span>
            <div className="text-right">
              <span
                className={`text-2xl font-extrabold ${
                  isFreeGrant ? "text-success" : "text-primary"
                }`}
              >
                {isFreeGrant
                  ? `${t(AppLocales.Payment.CheckoutDialog.Free)} (${formatMoney(0, validationResult?.currency || product.currency)})`
                  : finalPriceDisplay}
              </span>
              {product.recurring && (
                <span className="text-xs text-base-content/60 ml-1">
                  /{product.period_label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant={ButtonVariants.PRIMARY}
            fullWidth
            size={ComponentSizes.LG}
            onClick={handleCheckout}
            disabled={
              isSubmitting ||
              isValidating ||
              (!!couponCode.trim() && !validationResult?.valid && cooldown.isActive)
            }
          >
            {isSubmitting
              ? t(AppLocales.Payment.CheckoutDialog.Processing)
              : isFreeGrant
              ? t(AppLocales.Payment.CheckoutDialog.ClaimFree)
              : t(AppLocales.Payment.CheckoutDialog.Proceed)}
          </Button>
          <Button
            variant={ButtonVariants.TERTIARY}
            fullWidth
            size={ComponentSizes.SM}
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t(AppLocales.Common.Cancel)}
          </Button>
        </div>
      </div>
      )}
    </Dialog>
  );
};
