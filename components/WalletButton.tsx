"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { useLang } from "@/lib/i18n";

export function WalletButton() {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();

  useEffect(() => {
    // Wallet state only exists client-side; avoids a hydration mismatch on first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="inline-block h-8 w-[100px] border border-border" />;
  }

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: connectors[0] })}
        disabled={isPending}
        className="rounded-none border border-yellow-dim px-3 py-1.5 font-mono text-xs text-yellow hover:bg-yellow hover:text-background disabled:opacity-60"
      >
        {isPending ? t.wallet.connecting : t.wallet.connect}
      </button>
    );
  }

  if (chainId !== bsc.id) {
    return (
      <button
        onClick={() => switchChain({ chainId: bsc.id })}
        disabled={switching}
        className="rounded-none border border-yellow-dim px-3 py-1.5 font-mono text-xs text-yellow disabled:opacity-60"
      >
        {t.wallet.switchNetwork}
      </button>
    );
  }

  return (
    <button
      onClick={() => disconnect()}
      title={t.wallet.disconnect}
      className="rounded-none border border-border px-3 py-1.5 font-mono text-xs text-foreground hover:border-yellow-dim"
    >
      {address?.slice(0, 6)}…{address?.slice(-4)}
    </button>
  );
}
