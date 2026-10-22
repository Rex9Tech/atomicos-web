import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { iconsLib } from "../../../../assets";
import {
  DateTime,
  DateTimeFormats,
  Dropdown,
  DropdownSizes,
  SearchInput,
} from "../../../../design";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { useLoading } from "../../../../contexts";
import type { IApiPagination } from "../../../../models";
import { AppLocales, useTranslate } from "../../../../locales";
import {
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
} from "../../constants";
import {
  AdminKpiCard,
  AdminPagination,
  AdminState,
  AdminTable,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import PaymentController from "../payment.controller";
import { ADMIN_CREDIT_TABLE_KEYS } from "../constants";
import type { IAdminCreditTransaction, IAdminCreditSummary } from "../types";

const KNOWN_SOURCES = [
  "chat",
  "meeting_summary",
  "signup",
  "backfill",
  "purchase",
] as const;

const KIND_OPTIONS = [
  { value: "", labelKey: "all" as const },
  { value: "spend", labelKey: "spend" as const },
  { value: "grant", labelKey: "grant" as const },
];

export const AdminCreditsPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Credits.Title)} | Admin`);
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || 1);
  const kind = params.get("kind") || "";
  const source = params.get("source") || "";
  const search = params.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [records, setRecords] = useState<IAdminCreditTransaction[]>([]);
  const [summary, setSummary] = useState<IAdminCreditSummary | null>(null);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const { isLoading, setLoading } = useLoading();
  const { can, isLoading: permissionsLoading } = usePermissions();

  const update = useCallback(
    (values: Record<string, string | number>) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          Object.entries(values).forEach(([key, value]) =>
            value && value !== 1
              ? next.set(key, String(value))
              : next.delete(key),
          );
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  useEffect(() => {
    const timer = window.setTimeout(
      () =>
        searchInput !== search &&
        update({ search: searchInput.trim(), page: 1 }),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [search, searchInput, update]);

  const sourceLabel = useCallback(
    (value?: string | null) => {
      if (!value) return "—";
      const key = value.startsWith("purchase") ? "purchase" : value;
      const map: Record<string, string> = {
        chat: t(AppLocales.Admin.Credits.Sources.Chat),
        meeting_summary: t(AppLocales.Admin.Credits.Sources.MeetingSummary),
        signup: t(AppLocales.Admin.Credits.Sources.Signup),
        backfill: t(AppLocales.Admin.Credits.Sources.Backfill),
        purchase: t(AppLocales.Admin.Credits.Sources.Purchase),
        other: t(AppLocales.Admin.Credits.Sources.Other),
      };
      return map[key] || key.replace(/_/g, " ");
    },
    [t],
  );

  const loadCredits = useCallback(async () => {
    if (
      permissionsLoading ||
      !can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.CREDITS)
    )
      return;

    setError("");
    setLoading(true);

    try {
      const [listResult, summaryResult] = await Promise.all([
        PaymentController.getCredits({
          page,
          limit: ADMIN_PAGE_SIZE,
          kind: kind || undefined,
          source: source || undefined,
          search: search || undefined,
        }),
        PaymentController.getCreditSummary(),
      ]);

      if (listResult.success) {
        setRecords(listResult.credits);
        setPagination(listResult.pagination);
      } else {
        setError(
          listResult.error || t(AppLocales.Admin.Credits.Errors.Load),
        );
      }

      if (summaryResult.success) {
        setSummary(summaryResult.summary);
      }
    } finally {
      setLoading(false);
    }
  }, [can, kind, page, permissionsLoading, search, setLoading, source, t]);

  useEffect(() => {
    void loadCredits();
  }, [loadCredits]);

  const sourceOptions = useMemo(() => {
    const merged = new Set<string>([...KNOWN_SOURCES]);
    if (summary) {
      Object.keys(summary.spend_by_source).forEach((key) =>
        merged.add(key.startsWith("purchase") ? "purchase" : key),
      );
      Object.keys(summary.grant_by_source).forEach((key) => merged.add(key));
    }
    return [...merged];
  }, [summary]);

  const columns: IAdminTableColumn<IAdminCreditTransaction>[] = useMemo(
    () => [
      {
        key: ADMIN_CREDIT_TABLE_KEYS.USER,
        header: t(AppLocales.Admin.Credits.Table.User),
        render: (record) => (
          <div>
            <div className="font-medium">
              {record.username || record.email || "—"}
            </div>
            {record.username && record.email && (
              <div className="text-xs opacity-60">{record.email}</div>
            )}
          </div>
        ),
      },
      {
        key: ADMIN_CREDIT_TABLE_KEYS.MOVEMENT,
        header: t(AppLocales.Admin.Credits.Table.Movement),
        render: (record) => (
          <span
            className={`badge badge-sm ${
              record.kind === "grant" ? "badge-success" : "badge-ghost"
            }`}
          >
            {record.kind === "grant"
              ? t(AppLocales.Admin.Credits.Kinds.Grant)
              : t(AppLocales.Admin.Credits.Kinds.Spend)}
          </span>
        ),
      },
      {
        key: ADMIN_CREDIT_TABLE_KEYS.SOURCE,
        header: t(AppLocales.Admin.Credits.Table.Source),
        render: (record) => sourceLabel(record.source),
      },
      {
        key: ADMIN_CREDIT_TABLE_KEYS.AMOUNT,
        header: t(AppLocales.Admin.Credits.Table.Amount),
        render: (record) => (
          <span
            className={
              record.amount > 0
                ? "text-success font-semibold"
                : "text-error font-semibold"
            }
          >
            {record.amount > 0 ? "+" : ""}
            {record.amount.toLocaleString()}
          </span>
        ),
      },
      {
        key: ADMIN_CREDIT_TABLE_KEYS.BALANCE,
        header: t(AppLocales.Admin.Credits.Table.Balance),
        render: (record) => record.balance_after.toLocaleString(),
      },
      {
        key: ADMIN_CREDIT_TABLE_KEYS.DATE,
        header: t(AppLocales.Admin.Credits.Table.Date),
        render: (record) => (
          <DateTime value={record.created_at} format={DateTimeFormats.ADMIN} />
        ),
      },
    ],
    [sourceLabel, t],
  );

  const usageRows = (data?: Record<string, number>) =>
    data
      ? Object.entries(data).sort((a, b) => b[1] - a[1])
      : ([] as [string, number][]);

  const totals = summary?.totals;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(AppLocales.Admin.Credits.Title)}
        description={t(AppLocales.Admin.Credits.Description)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminKpiCard
          title={t(AppLocales.Admin.Credits.Stats.Granted)}
          value={(totals?.granted ?? 0).toLocaleString()}
          icon={iconsLib.banknotes}
        />
        <AdminKpiCard
          title={t(AppLocales.Admin.Credits.Stats.Spent)}
          value={(totals?.spent ?? 0).toLocaleString()}
          icon={iconsLib.sparkles}
        />
        <AdminKpiCard
          title={t(AppLocales.Admin.Credits.Stats.Outstanding)}
          value={(totals?.outstanding ?? 0).toLocaleString()}
          icon={iconsLib.chartBar}
        />
        <AdminKpiCard
          title={t(AppLocales.Admin.Credits.Stats.Users)}
          value={(totals?.users_with_credits ?? 0).toLocaleString()}
          icon={iconsLib.userGroup}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(
          [
            {
              title: t(AppLocales.Admin.Credits.Usage.SpentBySource),
              rows: usageRows(summary?.spend_by_source),
            },
            {
              title: t(AppLocales.Admin.Credits.Usage.GrantedBySource),
              rows: usageRows(summary?.grant_by_source),
            },
          ] as const
        ).map((panel) => (
          <div
            key={panel.title}
            className="bg-base-100 p-4 rounded-xl border border-base-200"
          >
            <h3 className="font-semibold mb-3">{panel.title}</h3>
            {panel.rows.length === 0 ? (
              <div className="text-sm opacity-60">—</div>
            ) : (
              <div className="space-y-2">
                {panel.rows.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{sourceLabel(key)}</span>
                    <span className="font-semibold">
                      {value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-base-100 p-4 rounded-xl border border-base-200">
        <div className="w-full sm:w-64">
          <SearchInput
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onClear={() => setSearchInput("")}
            placeholder={t(AppLocales.Admin.Credits.Search)}
            searchableKeys={[
              t(AppLocales.Admin.Credits.Table.User),
              t(AppLocales.Admin.Credits.Table.Source),
            ]}
          />
        </div>
        <div className="w-full sm:w-44">
          <Dropdown
            size={DropdownSizes.MD}
            value={kind}
            onValueChange={(value) => update({ kind: value, page: 1 })}
            options={KIND_OPTIONS.map((option) => ({
              value: option.value,
              label:
                option.labelKey === "all"
                  ? t(AppLocales.Admin.Credits.Filters.AllKinds)
                  : option.labelKey === "spend"
                    ? t(AppLocales.Admin.Credits.Filters.Spend)
                    : t(AppLocales.Admin.Credits.Filters.Grant),
            }))}
          />
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            size={DropdownSizes.MD}
            value={source}
            onValueChange={(value) => update({ source: value, page: 1 })}
            options={[
              {
                value: "",
                label: t(AppLocales.Admin.Credits.Filters.AllSources),
              },
              ...sourceOptions.map((value) => ({
                value,
                label: sourceLabel(value),
              })),
            ]}
          />
        </div>
      </div>

      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : !isLoading && records.length === 0 ? (
        <AdminState
          icon={iconsLib.sparkles}
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.Common.State.EmptyDesc)}
        />
      ) : (
        <>
          <AdminTable
            records={records}
            columns={columns}
            getRowKey={(record) => record.id}
          />
          <AdminPagination
            pagination={pagination}
            onPageChange={(value) => update({ page: value })}
          />
        </>
      )}
    </div>
  );
};

export default AdminCreditsPage;
