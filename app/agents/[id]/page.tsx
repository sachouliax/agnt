"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { parseEther } from "viem";
import { useAccount, useConnect, useSendTransaction, usePublicClient } from "wagmi";
import { bsc } from "wagmi/chains";
import { useLang } from "@/lib/i18n";
import { WalletButton } from "@/components/WalletButton";
import { RentModal, type RentStage } from "@/components/RentModal";
import { AgentChat } from "@/components/AgentChat";
import { encodeRentPayload } from "@/lib/web3/memo";
import { describeSendError } from "@/lib/web3/errors";
import { REGISTRY_ADDRESS, RENT_PRICE_BNB, BSCSCAN_TX_BASE } from "@/lib/config";
import type { Agent } from "@/lib/agents";
import type { Rental } from "@/lib/rentals";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export default function AgentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();

  const { isConnected, address, chainId } = useAccount();
  const { connectors, connect, isPending: connecting } = useConnect();
  const { sendTransactionAsync } = useSendTransaction();
  const publicClient = usePublicClient();

  const [agent, setAgent] = useState<Agent | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rental, setRental] = useState<Rental | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [stage, setStage] = useState<RentStage | "idle">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshRental = useCallback(() => {
    fetch(`/api/agents/${id}/rent`)
      .then((res) => res.json())
      .then((data) => setRental(data.rental ?? null))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    fetch(`/api/agents/${id}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => data && setAgent(data.agent))
      .catch(() => setNotFound(true));
  }, [id]);

  useEffect(() => {
    refreshRental();
  }, [refreshRental]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeRental = rental && rental.expiresAt > now ? rental : null;

  async function handleRent() {
    if (!REGISTRY_ADDRESS || !publicClient || !agent) return;
    setErrorMessage(null);
    setTxHash(null);
    setStage("sign");

    let hash: `0x${string}`;
    try {
      hash = await sendTransactionAsync({
        to: REGISTRY_ADDRESS,
        value: parseEther(RENT_PRICE_BNB),
        data: encodeRentPayload({ agentId: agent.id }),
        type: "legacy",
      });
    } catch (err) {
      setErrorMessage(describeSendError(err, t.rent.errorRejected, t.launch.errorGeneric));
      setStage("error");
      return;
    }

    setTxHash(hash);
    setStage("broadcast");
    await sleep(300);
    setStage("confirm");

    try {
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") {
        setErrorMessage(t.launch.errorGeneric);
        setStage("error");
        return;
      }
    } catch {
      setErrorMessage(t.launch.errorGeneric);
      setStage("error");
      return;
    }

    setStage("record");
    try {
      const res = await fetch(`/api/agents/${agent.id}/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash: hash, renter: address }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(
          data.error === "already_rented" ? t.rent.errorAlreadyRented : t.launch.errorVerification
        );
        setStage("error");
        return;
      }

      const data = await res.json();
      setRental(data.rental);
      setStage("success");
    } catch {
      setErrorMessage(t.launch.errorVerification);
      setStage("error");
    }
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <p className="text-muted">{t.agents.notFound}</p>
        <Link href="/agents" className="mt-4 inline-block text-yellow underline decoration-yellow-dim">
          {t.agents.backLink}
        </Link>
      </div>
    );
  }

  if (!agent) {
    return <div className="mx-auto max-w-2xl px-5 py-16 font-mono text-sm text-muted">…</div>;
  }

  const isMine = activeRental && address && activeRental.renter.toLowerCase() === address.toLowerCase();

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/agents" className="text-sm text-muted hover:text-foreground">
        {t.agents.backLink}
      </Link>

      <div className="mt-6 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center bg-yellow font-mono text-2xl font-bold text-background">
          {agent.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{agent.name}</h1>
          <p className="text-sm text-yellow-dim">
            {agent.category}
            {agent.personality ? ` · ${agent.personality}` : ""}
          </p>
        </div>
      </div>

      <p className="mt-6 text-muted">{agent.description}</p>

      <div className="mt-8 space-y-2 border border-border bg-surface p-4 font-mono text-xs">
        <p className="text-muted">
          {t.agents.detailCreated}:{" "}
          <span className="text-foreground">{new Date(agent.createdAt).toLocaleString()}</span>
        </p>
        <p className="truncate text-muted">
          {t.agents.detailCreator}:{" "}
          <span className="text-foreground">{agent.creator}</span>
        </p>
        <a
          href={`${BSCSCAN_TX_BASE}${agent.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-yellow underline decoration-yellow-dim underline-offset-4 hover:text-foreground"
        >
          {t.agents.detailTx}: {agent.id} ↗
        </a>
      </div>

      <div className="mt-8 border border-yellow-dim bg-surface p-6">
        <p className="font-mono text-sm text-yellow">{t.rent.title}</p>

        {activeRental ? (
          <div className="mt-3 font-mono text-xs text-muted">
            <p>
              {isMine ? t.rent.rentedByYou : t.rent.rentedByLabel}
              {!isMine && (
                <>
                  : {activeRental.renter.slice(0, 6)}…{activeRental.renter.slice(-4)}
                </>
              )}
            </p>
            <p className="mt-1 text-yellow-dim">
              {t.rent.expiresIn}: {formatRemaining(activeRental.expiresAt - now)}
            </p>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">{t.rent.priceLine}</p>

            {!isConnected ? (
              <button
                onClick={() => connect({ connector: connectors[0] })}
                disabled={connecting}
                className="mt-5 rounded-none border border-yellow-dim px-4 py-2 font-mono text-sm text-yellow hover:bg-yellow hover:text-background disabled:opacity-60"
              >
                {connecting ? t.wallet.connecting : t.wallet.connect}
              </button>
            ) : chainId !== bsc.id ? (
              <div className="mt-5">
                <WalletButton />
              </div>
            ) : (
              <button
                onClick={handleRent}
                disabled={stage !== "idle" && stage !== "success" && stage !== "error"}
                className="mt-5 rounded-none bg-yellow px-5 py-2.5 font-semibold text-background transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {t.rent.button}
              </button>
            )}
          </>
        )}
      </div>

      <AgentChat agentId={agent.id} agentName={agent.name} />

      {stage !== "idle" && (
        <RentModal
          stage={stage}
          txHash={txHash}
          errorMessage={errorMessage}
          onClose={() => {
            setStage("idle");
            refreshRental();
          }}
        />
      )}
    </div>
  );
}
