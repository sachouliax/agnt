"use client";

import { useState } from "react";
import { useAccount, useConnect, useSendTransaction, usePublicClient } from "wagmi";
import { bsc } from "wagmi/chains";
import { useLang } from "@/lib/i18n";
import { DeployModal, type Stage } from "@/components/DeployModal";
import { WalletButton } from "@/components/WalletButton";
import { encodeAgentPayload } from "@/lib/web3/memo";
import { REGISTRY_ADDRESS } from "@/lib/config";
import type { Agent } from "@/lib/agents";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function LaunchPage() {
  const { t } = useLang();
  const categories = t.launch.categories;

  const { isConnected, address, chainId } = useAccount();
  const { connectors, connect, isPending: connecting } = useConnect();
  const { sendTransactionAsync } = useSendTransaction();
  const publicClient = usePublicClient();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(categories[0]);
  const [description, setDescription] = useState("");
  const [fieldError, setFieldError] = useState<"name" | "description" | null>(null);
  const [stage, setStage] = useState<Stage | "idle">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (trimmedName.length < 2 || trimmedName.length > 40) {
      setFieldError("name");
      return;
    }
    if (trimmedDescription.length < 10 || trimmedDescription.length > 280) {
      setFieldError("description");
      return;
    }
    if (!REGISTRY_ADDRESS || !publicClient) {
      setErrorMessage(t.launch.registryNotConfigured);
      setStage("error");
      return;
    }

    setTxHash(null);
    setStage("sign");

    let hash: `0x${string}`;
    try {
      hash = await sendTransactionAsync({
        to: REGISTRY_ADDRESS,
        value: BigInt(0),
        data: encodeAgentPayload({
          name: trimmedName,
          category,
          description: trimmedDescription,
        }),
      });
    } catch {
      setErrorMessage(t.launch.errorRejected);
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

    setStage("index");
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          category,
          description: trimmedDescription,
          txHash: hash,
          creator: address,
        }),
      });

      if (!res.ok) {
        setErrorMessage(t.launch.errorVerification);
        setStage("error");
        return;
      }

      const data = await res.json();
      setAgent(data.agent);
      setStage("success");
    } catch {
      setErrorMessage(t.launch.errorVerification);
      setStage("error");
    }
  }

  function reset() {
    setStage("idle");
    setAgent(null);
    setTxHash(null);
    setErrorMessage(null);
    setName("");
    setDescription("");
    setCategory(categories[0]);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">{t.launch.title}</h1>
      <p className="mt-2 text-muted">{t.launch.subtitle}</p>

      {!isConnected ? (
        <div className="mt-10 border border-border bg-surface p-6">
          <p className="font-mono text-sm text-yellow">{t.launch.walletGateTitle}</p>
          <p className="mt-2 text-sm text-muted">{t.launch.walletGateText}</p>
          <button
            onClick={() => connect({ connector: connectors[0] })}
            disabled={connecting}
            className="mt-5 rounded-none border border-yellow-dim px-4 py-2 font-mono text-sm text-yellow hover:bg-yellow hover:text-background disabled:opacity-60"
          >
            {connecting ? t.wallet.connecting : t.wallet.connect}
          </button>
        </div>
      ) : chainId !== bsc.id ? (
        <div className="mt-10 border border-border bg-surface p-6">
          <p className="font-mono text-sm text-yellow">{t.wallet.wrongNetwork}</p>
          <div className="mt-5">
            <WalletButton />
          </div>
        </div>
      ) : (
        <>
          <p className="mt-6 border border-border bg-surface p-4 text-xs text-muted">
            {t.launch.gasNotice}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                {t.launch.fieldName}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.launch.fieldNamePlaceholder}
                maxLength={40}
                className="w-full rounded-none border border-border bg-surface px-4 py-3 outline-none focus:border-yellow-dim"
              />
              {fieldError === "name" && (
                <p className="mt-1 text-xs text-red-400">{t.launch.errorName}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                {t.launch.fieldCategory}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-none border border-border bg-surface px-4 py-3 outline-none focus:border-yellow-dim"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                {t.launch.fieldDescription}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.launch.fieldDescriptionPlaceholder}
                maxLength={280}
                rows={5}
                className="w-full rounded-none border border-border bg-surface px-4 py-3 outline-none focus:border-yellow-dim"
              />
              <div className="mt-1 flex items-center justify-between">
                {fieldError === "description" ? (
                  <p className="text-xs text-red-400">{t.launch.errorDescription}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-muted">{description.length}/280</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={stage !== "idle" && stage !== "success" && stage !== "error"}
              className="w-full rounded-none bg-yellow px-5 py-3 font-semibold text-background transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {t.launch.submit}
            </button>
          </form>
        </>
      )}

      {stage !== "idle" && (
        <DeployModal
          name={name}
          stage={stage}
          txHash={txHash}
          agent={agent}
          errorMessage={errorMessage}
          onLaunchAnother={reset}
          onClose={() => setStage("idle")}
        />
      )}
    </div>
  );
}
