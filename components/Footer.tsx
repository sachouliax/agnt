"use client";

import { useLang } from "@/lib/i18n";
import { ContractProof } from "./ContractProof";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-sm text-foreground">
            AGNT<span className="text-yellow">.</span>
          </p>
          <p className="mt-1 text-xs text-muted">{t.footer.tagline}</p>
          <p className="mt-1 text-xs text-muted">{t.footer.rights}</p>
        </div>
        <ContractProof />
      </div>
    </footer>
  );
}
