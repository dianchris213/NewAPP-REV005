import { memo } from "react";
import { Icon } from "./Icon";
import { formatIDR, type Transaction } from "@/lib/app-store";

const TransactionRow = memo(function TransactionRow({ t }: { t: Transaction }) {
  return (
    <li
      className={`flex items-center gap-3 border-b border-outline-variant/20 py-3 last:border-0 transition-opacity ${
        t.pending ? "opacity-60" : "opacity-100"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          t.type === "income" ? "bg-success/15 text-success" : "bg-error/15 text-error"
        }`}
      >
        <Icon
          name={t.type === "income" ? "south_west" : "north_east"}
          className="text-[18px]"
          fill={1}
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body font-medium text-on-surface">{t.category}</span>
        {t.note ? (
          <span className="truncate text-meta text-on-surface-variant">{t.note}</span>
        ) : null}
        <span className="truncate text-meta text-on-surface-variant/60">
          {new Date(t.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          {t.pending ? " · menyimpan..." : ""}
        </span>
      </div>
      <span
        className={`shrink-0 text-body font-semibold ${
          t.type === "income" ? "text-success" : "text-error"
        }`}
      >
        {t.type === "income" ? "+" : "-"}
        {formatIDR(t.amount)}
      </span>
    </li>
  );
});

export const TransactionList = memo(function TransactionList({
  items,
}: {
  items: Transaction[];
}) {
  return (
    <ul className="glass-card rounded-[18px] px-4">
      {items.map((t) => (
        <TransactionRow key={t.id} t={t} />
      ))}
    </ul>
  );
});
