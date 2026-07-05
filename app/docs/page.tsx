"use client";

import { useLang } from "@/lib/i18n";
import { ContractProof } from "@/components/ContractProof";
import { Typewriter } from "@/components/Typewriter";
import { Pipeline } from "@/components/Pipeline";

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-mono text-sm tracking-widest text-yellow">
      {"// "}
      {children}
    </h2>
  );
}

const statusColor: Record<string, string> = {
  done: "text-yellow",
  active: "text-yellow-dim",
  planned: "text-muted",
};

const statusMark: Record<string, string> = {
  done: "[x]",
  active: "[~]",
  planned: "[ ]",
};

export default function DocsPage() {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">{t.docs.title}</h1>
      <p className="mt-3 text-muted">
        <Typewriter text={t.docs.intro} speed={8} />
      </p>

      <section className="mt-10 border border-yellow-dim bg-surface p-5">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-yellow" />
          <span className="font-mono text-xs tracking-widest text-yellow">
            {t.docs.statusBadge}
          </span>
        </div>
        <p className="mt-3 text-sm text-muted">{t.docs.statusText}</p>
      </section>

      <section className="mt-16">
        <SectionKicker>{t.docs.whatTitle.toUpperCase()}</SectionKicker>
        <p className="text-muted">
          <Typewriter text={t.docs.whatText} speed={6} />
        </p>
      </section>

      <section className="mt-16">
        <SectionKicker>{t.docs.featuresTitle.toUpperCase()}</SectionKicker>
        <p className="mb-5 text-muted">
          <Typewriter text={t.docs.featuresIntro} speed={6} />
        </p>
        <ul className="space-y-2 border border-border bg-surface p-4 font-mono text-sm">
          {t.docs.features.map((feature) => (
            <li key={feature} className="flex gap-2 text-muted">
              <span className="text-yellow">[x]</span> {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <SectionKicker>{t.docs.architectureTitle.toUpperCase()}</SectionKicker>
        <p className="mb-5 text-muted">
          <Typewriter text={t.docs.architectureIntro} speed={6} />
        </p>
        <Pipeline steps={t.docs.architectureSteps} />
      </section>

      <section className="mt-16">
        <SectionKicker>{t.docs.lifecycleTitle.toUpperCase()}</SectionKicker>
        <p className="mb-5 text-muted">
          <Typewriter text={t.docs.lifecycleIntro} speed={6} />
        </p>
        <Pipeline steps={t.docs.lifecycleSteps} />
      </section>

      <section className="mt-16">
        <SectionKicker>{t.docs.registryTitle.toUpperCase()}</SectionKicker>
        <p className="text-muted">
          <Typewriter text={t.docs.registryText} speed={6} />
        </p>
      </section>

      <section className="mt-16">
        <SectionKicker>{t.docs.tokenTitle.toUpperCase()}</SectionKicker>
        <p className="mb-5 text-muted">
          <Typewriter text={t.docs.tokenIntro} speed={6} />
        </p>
        <ContractProof />
      </section>

      <section className="mt-16">
        <SectionKicker>{t.docs.launchMechanismTitle.toUpperCase()}</SectionKicker>
        <p className="mb-5 text-muted">
          <Typewriter text={t.docs.launchMechanismIntro} speed={6} />
        </p>
        <Pipeline steps={t.docs.launchSteps} />
      </section>

      <section className="mt-16">
        <SectionKicker>{t.docs.verificationTitle.toUpperCase()}</SectionKicker>
        <p className="mb-5 text-muted">
          <Typewriter text={t.docs.verificationText} speed={6} />
        </p>
        <ul className="space-y-2 border border-border bg-surface p-4 font-mono text-sm">
          {t.docs.verificationPoints.map((point) => (
            <li key={point} className="flex gap-2 text-muted">
              <span className="text-yellow-dim">$</span> {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <SectionKicker>{t.docs.roadmapTitle.toUpperCase()}</SectionKicker>
        <div className="space-y-2">
          {t.docs.roadmapPhases.map((phase) => (
            <div
              key={phase.label}
              className="flex flex-col gap-1 border border-border bg-surface p-4 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className={`font-mono text-sm ${statusColor[phase.status]}`}>
                {statusMark[phase.status]} {phase.label}
              </span>
              <span className="text-sm text-muted">{phase.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionKicker>{t.docs.faqTitle.toUpperCase()}</SectionKicker>
        <div className="space-y-4">
          {t.docs.faq.map((item) => (
            <div key={item.q} className="border border-border bg-surface p-4">
              <p className="font-semibold">{item.q}</p>
              <p className="mt-1.5 text-sm text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
