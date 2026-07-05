"use client";

import { useLang } from "@/lib/i18n";
import { CONTRACT_ADDRESS, BSCSCAN_ADDRESS_BASE } from "@/lib/config";

export function ContractProof() {
  const { t } = useLang();

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-none border border-border bg-surface px-4 py-3 font-mono text-sm">
      <span className="text-muted">{t.common.contractLabel}</span>
      {CONTRACT_ADDRESS ? (
        <a
          href={`${BSCSCAN_ADDRESS_BASE}${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow underline decoration-yellow-dim underline-offset-4 hover:text-foreground"
        >
          {CONTRACT_ADDRESS.slice(0, 6)}…{CONTRACT_ADDRESS.slice(-4)} · {t.common.viewOnBscscan} ↗
        </a>
      ) : (
        <span className="rounded-none border border-yellow-dim px-2.5 py-0.5 text-xs text-yellow-dim">
          {t.common.contractPending}
        </span>
      )}
    </div>
  );
}
