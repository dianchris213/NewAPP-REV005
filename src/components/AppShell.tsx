import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Icon } from "./Icon";
import { AddTransactionSheet } from "./AddTransactionSheet";
import { useApp } from "@/lib/app-store";

const tabs = [
  { to: "/", label: "Beranda", icon: "home" },
  { to: "/analytics", label: "Analitik", icon: "equalizer" },
  { to: "/wallet", label: "Dompet", icon: "account_balance_wallet" },
  { to: "/settings", label: "Pengaturan", icon: "settings" },
] as const;

export function TopBar({
  eyebrow,
  title,
  actions,
}: {
  eyebrow?: string;
  title: string;
  actions?: ReactNode;
}) {
  const { user } = useApp();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-high text-on-surface-variant">
          <Icon name="person" className="text-[20px]" />
        </div>
        <div className="flex flex-col">
          <span className="text-meta text-on-surface-variant/80">
            {eyebrow ?? user?.handle ?? "Catatan Keuangan"}
          </span>
          <h1 className="m-0 text-section text-on-surface">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-1 text-on-surface-variant">
        {actions ?? (
          <>
            <button
              aria-label="Sinkronisasi"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant/60"
            >
              <Icon name="cloud" className="text-[20px]" />
            </button>
            <button
              aria-label="Notifikasi"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant/60"
            >
              <Icon name="notifications" className="text-[20px]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function AppShell({
  children,
  topBar,
}: {
  children: ReactNode;
  topBar?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { hydrated, user, setAddTxOpen } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/login" });
  }, [hydrated, user, navigate]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-on-background antialiased">
      <div className="pointer-events-none fixed -top-24 left-1/2 h-64 w-[420px] -translate-x-1/2 rounded-full bg-primary-container/25 blur-[90px]" />
      {topBar ? (
        <header className="sticky top-0 z-40 border-b border-outline-variant/15 bg-background/85 px-margin-main pt-safe-area-top pb-3 backdrop-blur-xl">
          {topBar}
        </header>
      ) : null}
      <main className="relative z-10 flex-1 overflow-x-hidden px-margin-main pt-stack-md pb-[136px]">
        {children}
      </main>

      <nav
        aria-label="Navigasi utama"
        className="fixed bottom-0 left-0 z-50 flex h-[72px] w-full items-center justify-around border-t border-outline-variant/15 bg-surface-container-lowest/85 px-gutter-grid pb-safe-area-bottom backdrop-blur-xl"
      >
        {tabs.slice(0, 2).map((t) => (
          <NavItem key={t.to} {...t} active={pathname === t.to} />
        ))}
        <button
          type="button"
          onClick={() => setAddTxOpen(true)}
          className="group -mt-8 flex w-16 flex-col items-center justify-center transition-all active:scale-95"
          aria-label="Tambah transaksi"
        >
          <div className="gradient-primary flex h-14 w-14 items-center justify-center rounded-full text-on-primary-container shadow-glow ring-4 ring-background">
            <Icon name="add" className="text-[28px]" fill={1} />
          </div>
        </button>
        {tabs.slice(2).map((t) => (
          <NavItem key={t.to} {...t} active={pathname === t.to} />
        ))}
      </nav>

      <AddTransactionSheet />
    </div>
  );
}

function NavItem({
  to,
  label,
  icon,
  active,
}: {
  to: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`flex w-16 flex-col items-center justify-center gap-1 transition-all active:scale-90 ${
        active ? "text-primary" : "text-on-surface-variant/70"
      }`}
    >
      <span
        className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
          active ? "bg-primary-container/25" : ""
        }`}
      >
        <Icon name={icon} className="text-[22px]" fill={active ? 1 : 0} />
      </span>
      <span className="text-[10px] font-semibold tracking-wide">{label}</span>
    </Link>
  );
}
