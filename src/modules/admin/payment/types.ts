import type { TSortOrder } from "../../../hooks/useSort";
import type { ISubscription, IPurchase } from "../../payment/types";

export interface IAdminPaymentIdentity {
  product_code?: string | null;
  user_name?: string | null;
  username?: string | null;
  user_email?: string | null;
}

export type IAdminPurchase = IPurchase & IAdminPaymentIdentity;
export type IAdminSubscription = ISubscription & IAdminPaymentIdentity;

export interface IAdminPurchaseFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  currency?: string;
  product_id?: string;
  user_id?: string;
  sort_by?: string;
  sort_order?: TSortOrder;
}

export interface IAdminSubscriptionFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  interval?: string;
  product_id?: string;
  user_id?: string;
  cancel_at_period_end?: boolean;
  sort_by?: string;
  sort_order?: TSortOrder;
}

export interface IAdminCouponFilters {
  page?: number;
  limit?: number;
  search?: string;
  coupon_type?: string;
  discarded?: boolean;
  referrer_id?: string;
  sort_by?: string;
  sort_order?: TSortOrder;
}

export interface IAdminUserCouponFilters {
  page?: number;
  limit?: number;
  coupon_id?: string;
  user_id?: string;
  product_id?: string;
  payment_type?: string;
  search?: string;
  sort_by?: string;
  sort_order?: TSortOrder;
}

export interface ICreateCouponPayload {
  title: string;
  description?: string;
  code?: string;
  coupon_type: "percentage" | "fixed";
  amount: number;
  currency?: string;
  max_usage?: number;
  max_usage_per_user?: number;
  expires_at?: string;
  target_role_ids?: string[];
  target_user_ids?: string[];
  target_user_emails?: string[];
  target_product_ids?: string[];
}

export interface IBatchCreateCouponPayload {
  count: number;
  prefix?: string;
  coupon: ICreateCouponPayload;
}

export interface IAdminCreditTransaction {
  id: string;
  user_id?: string;
  kind: "grant" | "spend" | string;
  amount: number;
  balance_after: number;
  source?: string | null;
  email?: string | null;
  username?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
}

export interface IAdminCreditFilters {
  page?: number;
  limit?: number;
  kind?: string;
  source?: string;
  search?: string;
  user_id?: string;
}

export interface IAdminCreditSummary {
  totals: {
    granted: number;
    spent: number;
    outstanding: number;
    users_with_credits: number;
  };
  spend_by_source: Record<string, number>;
  grant_by_source: Record<string, number>;
}
