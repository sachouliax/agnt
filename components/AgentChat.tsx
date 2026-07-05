"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Typewriter } from "@/components/Typewriter";

type ChatMessage = {
  role: "user" | "agent";
  text: string;
};

export function AgentChat({ agentId, agentName }: { agentId: string; agentName: string }) {
  const { t } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(`/api/agents/${agentId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === "rate_limited" ? t.chat.errorRateLimited : t.chat.errorGeneric);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "agent", text: data.reply }]);
    } catch {
      setError(t.chat.errorGeneric);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-8 border border-border bg-surface p-6">
      <p className="font-mono text-sm text-yellow">{t.chat.title}</p>

      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto font-mono text-sm">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-foreground" : "text-yellow-dim"}>
            <span className="text-muted">{m.role === "user" ? "you>" : `${agentName}>`}</span>{" "}
            {m.role === "agent" && i === messages.length - 1 ? (
              <Typewriter text={m.text} speed={8} />
            ) : (
              m.text
            )}
          </div>
        ))}
        {sending && (
          <div className="text-muted">
            <span>{agentName}&gt;</span> <span className="cursor-blink" />
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chat.placeholder}
          maxLength={500}
          className="flex-1 border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-yellow-dim"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="border border-yellow-dim px-4 py-2 text-sm font-semibold text-yellow hover:bg-yellow hover:text-background disabled:opacity-50"
        >
          {t.chat.send}
        </button>
      </form>
    </div>
  );
}
