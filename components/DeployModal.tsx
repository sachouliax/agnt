"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Agent } from "@/lib/agents";
import { BSCSCAN_TX_BASE } from "@/lib/config";

export type Stage = "sign" | "broadcast" | "confirm" | "index" | "success" | "error";

const STAGE_ORDER = ["sign", "broadcast", "confirm", "index"] as const;

export function DeployModal({
  name,
  stage,
  txHash,
  agent,
  errorMessage,
  onLaunchAnother,
  onClose,
}: {
  name: string;
  stage: Stage;
  txHash: string | null;
  agent: Agent | null;
  errorMessage: string | null;
  onLaunchAnother: () => void;
  onClose: () => void;
}) {
  const { t } = useLang();
  const running = stage !== "success" && stage !== "error";

  const currentIndex =
    stage === "success" || stage === "error"
      ? STAGE_ORDER.length - 1
      : STAGE_ORDER.indexOf(stage);
  const visibleStages = STAGE_ORDER.slice(0, currentIndex + 1);
  const progress =
    stage === "success" ? 100 : Math.round(((currentIndex + 1) / STAGE_ORDER.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-none border border-yellow-dim bg-surface p-6">
        {running && <div className="scan-line absolute inset-0" />}

        {!running && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-muted hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        {running && (
          <>
            <p className="font-mono text-sm text-yellow">
              {t.launch.deployTitle} {name}
              <span className="cursor-blink" />
            </p>
            <div className="mt-4 h-1 w-full overflow-hidden bg-surface-2">
              <div
                className="h-full bg-yellow transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-5 space-y-2 font-mono text-xs text-muted">
              {visibleStages.map((key, i) => (
                <div key={key} className={i === visibleStages.length - 1 ? "text-foreground" : ""}>
                  <span className="text-yellow-dim">{i < visibleStages.length - 1 ? "✓" : "$"}</span>{" "}
                  {t.launch.stages[key]}
                </div>
              ))}
              {txHash && (
                <div className="truncate text-muted">
                  <span className="text-yellow-dim">$</span> tx: {txHash}
                </div>
              )}
            </div>
          </>
        )}

        {stage === "success" && agent && (
          <div>
            <p className="font-mono text-sm text-yellow">
              ✓ {agent.name} {t.launch.successTitle}
            </p>
            <div className="mt-4 space-y-1 border border-border bg-surface-2 p-4 font-mono text-xs">
              <p className="text-muted">{t.launch.agentIdLabel}</p>
              <a
                href={`${BSCSCAN_TX_BASE}${agent.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-yellow underline decoration-yellow-dim underline-offset-4 hover:text-foreground"
              >
                {agent.id} ↗
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/agents"
                className="rounded-none bg-yellow px-4 py-2 text-sm font-semibold text-background"
              >
                {t.launch.viewCommunity}
              </Link>
              <button
                onClick={onLaunchAnother}
                className="rounded-none border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-yellow-dim"
              >
                {t.launch.launchAnother}
              </button>
            </div>
          </div>
        )}

        {stage === "error" && (
          <div>
            <p className="font-mono text-sm text-red-400">
              ✕ {errorMessage ?? t.launch.errorGeneric}
            </p>
            <button
              onClick={onClose}
              className="mt-5 rounded-none border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-yellow-dim"
            >
              {t.launch.launchAnother}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
