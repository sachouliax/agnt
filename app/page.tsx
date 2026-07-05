"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ContractProof } from "@/components/ContractProof";
import { Typewriter } from "@/components/Typewriter";

export default function Home() {
  const { t } = useLang();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-5 py-24 sm:py-32 lg:flex-row lg:justify-between">
          <div className="flex flex-col items-start gap-6">
            <span className="rounded-none border border-yellow-dim px-3 py-1 font-mono text-xs tracking-widest text-yellow">
              {t.home.eyebrow}
            </span>
            <h1 className="whitespace-pre-line text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              <Typewriter text={t.home.title} speed={35} />
            </h1>
            <p className="max-w-xl text-base text-muted sm:text-lg">
              <Typewriter text={t.home.subtitle} speed={10} />
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/launch"
                className="rounded-none bg-yellow px-5 py-3 font-semibold text-background transition-transform hover:scale-[1.02]"
              >
                {t.home.ctaPrimary}
              </Link>
              <Link
                href="/docs"
                className="rounded-none border border-border px-5 py-3 font-semibold text-foreground transition-colors hover:border-yellow-dim"
              >
                {t.home.ctaSecondary}
              </Link>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logobnbV1.svg"
            alt="AGNT"
            className="w-48 shrink-0 sm:w-64 lg:w-80"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="mb-10 font-mono text-sm tracking-widest text-yellow">
          {t.home.stepsTitle.toUpperCase()}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {t.home.steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-none border border-border bg-surface p-6"
            >
              <div className="mb-4 font-mono text-2xl text-yellow-dim">
                0{i + 1}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted">
                <Typewriter text={step.text} speed={10} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-20">
          <h2 className="max-w-2xl text-2xl font-bold sm:text-3xl">
            {t.home.proofTitle}
          </h2>
          <p className="max-w-xl text-muted">
            <Typewriter text={t.home.proofText} speed={10} />
          </p>
          <div className="max-w-md">
            <ContractProof />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 text-center">
        <h2 className="mx-auto mb-8 max-w-2xl text-3xl font-bold sm:text-4xl">
          {t.home.bannerTitle}
        </h2>
        <Link
          href="/launch"
          className="inline-block rounded-none bg-yellow px-8 py-4 font-semibold text-background transition-transform hover:scale-[1.02]"
        >
          {t.home.bannerCta}
        </Link>
      </section>
    </div>
  );
}
