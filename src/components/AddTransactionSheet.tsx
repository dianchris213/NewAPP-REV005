import { useCallback, useState } from "react";
import { useApp, type TxType } from "@/lib/app-store";
import { Icon } from "./Icon";

const categories: Record<TxType, string[]> = {
  income: ["Gaji", "Freelance", "Bonus", "Hadiah", "Lainnya"],
  expense: ["Makanan", "Transport", "Tagihan", "Belanja", "Hiburan", "Lainnya"],
};

const NOTE_MAX = 80;

export function AddTransactionSheet() {
  const { addTxOpen, setAddTxOpen, addTransaction } = useApp();
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState(false);

  const close = useCallback(() => setAddTxOpen(false), [setAddTxOpen]);

  if (!addTxOpen) return null;

  const numeric = Number(amount.replace(/\D/g, ""));
  const trimmedNote = note.trim();

  const reset = () => {
    setAmount("");
    setNote("");
    setNoteError(false);
    setType("expense");
    setCategory("Makanan");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeric) return;
    if (!trimmedNote) {
      setNoteError(true);
      return;
    }
    addTransaction({ type, amount: numeric, category, note: trimmedNote.slice(0, NOTE_MAX) });
    reset();
    setAddTxOpen(false);
  };

  const pickType = (next: TxType) => {
    setType(next);
    setCategory(categories[next][0] ?? "Lainnya");
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Tambah transaksi"
      onClick={() => setAddTxOpen(false)}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="glass-card w-full max-w-md rounded-t-[28px] px-margin-main pb-8 pt-4"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-outline/50" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-title text-on-surface">Tambah Transaksi</h2>
          <button
            type="button"
            aria-label="Tutup"
            onClick={() => setAddTxOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        <div
          className="mb-4 grid grid-cols-2 gap-2 rounded-full bg-surface-container p-1"
          role="tablist"
          aria-label="Jenis transaksi"
        >
          {(["income", "expense"] as TxType[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={type === t}
              onClick={() => pickType(t)}
              className={`rounded-full py-2 text-sm font-semibold transition-colors ${
                type === t
                  ? t === "income"
                    ? "bg-success/20 text-success"
                    : "bg-error/20 text-error"
                  : "text-on-surface-variant"
              }`}
            >
              {t === "income" ? "Pemasukan" : "Pengeluaran"}
            </button>
          ))}
        </div>

        <label className="text-label uppercase text-on-surface-variant" htmlFor="tx-amount">
          Nominal
        </label>
        <div className="mt-1 mb-4 flex items-center gap-2 rounded-[16px] border border-outline-variant/30 bg-surface-container-low px-4 py-3">
          <span className="text-on-surface-variant">Rp</span>
          <input
            id="tx-amount"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={amount ? Number(amount.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-transparent text-xl font-bold text-on-surface outline-none placeholder:text-outline"
          />
        </div>

        <span className="text-label uppercase text-on-surface-variant">Kategori</span>
        <div className="mt-2 mb-4 flex gap-2 swipe-x" role="group" aria-label="Kategori">
          {categories[type].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                category === c
                  ? "border-primary bg-primary-container/25 text-primary"
                  : "border-outline-variant/30 text-on-surface-variant"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="text-label uppercase text-on-surface-variant" htmlFor="tx-note">
          Catatan Singkat
        </label>
        <input
          id="tx-note"
          value={note}
          required
          maxLength={NOTE_MAX}
          aria-invalid={noteError}
          aria-describedby="tx-note-help"
          onChange={(e) => {
            setNote(e.target.value);
            if (noteError) setNoteError(false);
          }}
          placeholder={
            type === "income" ? "Contoh: Gaji bulan ini" : "Contoh: Bensin motor harian"
          }
          className={`mt-1 w-full rounded-[16px] border bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none placeholder:text-outline ${
            noteError ? "border-error" : "border-outline-variant/30"
          }`}
        />
        <p
          id="tx-note-help"
          className={`mt-1 mb-5 text-[11px] ${
            noteError ? "text-error" : "text-on-surface-variant/70"
          }`}
        >
          {noteError
            ? "Catatan singkat wajib diisi."
            : `Wajib: alasan ${type === "income" ? "pemasukan" : "pengeluaran"} ini.`}
        </p>

        <button
          type="submit"
          disabled={!numeric || !trimmedNote}
          className="gradient-primary flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-on-primary-container shadow-glow disabled:opacity-40"
        >
          <Icon name="check" className="text-[20px]" /> Simpan Transaksi
        </button>
      </form>
    </div>
  );
}
