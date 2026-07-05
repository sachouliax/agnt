"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { FOUR_MEME_URL } from "@/lib/config";
import { WalletButton } from "@/components/WalletButton";

const links = [
  { href: "/", key: "home" as const },
  { href: "/launch", key: "launch" as const },
  { href: "/agents", key: "agents" as const },
  { href: "/docs", key: "docs" as const },
];

export function Navbar() {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="flex items-center gap-1.5 border-b border-border px-5 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-dim" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-3 font-mono text-[11px] text-muted">
          guest@agnt:~$
          <span className="cursor-blink" />
        </span>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-2 font-mono text-lg font-bold tracking-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logobnbV1.svg" alt="AGNT" className="h-8 w-8 shrink-0" />
          <span>
            AGNT<span className="text-yellow">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-none px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-surface-2 text-yellow"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {t.nav[link.key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            className="rounded-none border border-border px-2.5 py-1.5 font-mono text-xs text-muted hover:border-yellow-dim hover:text-foreground"
            aria-label="Toggle language"
          >
            {lang === "en" ? "EN / 中文" : "中文 / EN"}
          </button>
          <WalletButton />
          <a
            href={FOUR_MEME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-none bg-yellow px-3 py-1.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:inline-block"
          >
            {t.nav.buy}
          </a>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-5 py-2 sm:hidden">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-none px-3 py-1.5 text-sm ${
                active ? "bg-surface-2 text-yellow" : "text-muted"
              }`}
            >
              {t.nav[link.key]}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
