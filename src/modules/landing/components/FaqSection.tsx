// src/modules/landing/components/FaqSection.tsx

import React, { useState } from "react";
import AppRoutes from "../../../AppRoutes";
import { iconsLib } from "../../../assets";
import { TextLink } from "../../../design";

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface IFaqSectionProps {
  id?: string;
  className?: string;
  variant?: "general" | "comparison";
}

export const GENERAL_FAQS: IFaqItem[] = [
  {
    question: "What is AtomicOS?",
    answer:
      "AtomicOS is an AI workspace for your notes, meetings, and files. You capture everything as atoms, organize them into neurons, and use AI to write, summarize, and answer questions across it all.",
  },
  {
    question: "What is an atom?",
    answer:
      "An atom is the core unit of AtomicOS. A note, an uploaded file, a recording, or a meeting all become atoms, each with a title, summary, category, and optional meeting date.",
  },
  {
    question: "What are neurons?",
    answer:
      "Neurons are how you organize atoms. Group them into neurons like Projects, Clients, or Ideas, and keep every piece of context in the right place. Removing an atom from a neuron never deletes its content.",
  },
  {
    question: "Which AI models power AtomicOS?",
    answer:
      "AtomicOS routes each AI action across leading models, including Google Gemini and DeepSeek. Every AI run records its tokens, latency, and cost, so operators always know what was spent.",
  },
  {
    question: "Can AtomicOS transcribe meetings live?",
    answer:
      "Yes. Start a live session and AtomicOS streams speech to text in real time. When you finish, the transcript stays attached to the meeting atom, ready to search or summarize.",
  },
  {
    question: "Which languages does AtomicOS support?",
    answer:
      "The interface ships in English and Burmese today, with more languages on the way.",
  },
  {
    question: "How do credits work?",
    answer:
      "AI actions spend credits. New accounts start with free credits, and you can top up with the wallets you already use, including KBZPay, WavePay, AyaPay, and MMQR.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Sessions lock to one device per platform, tokens are revoked when you sign out, and you can delete your account and its files at any time from Settings.",
  },
  {
    question: "Where can I use AtomicOS?",
    answer:
      "In any modern browser today. Native iOS and Android apps are in final testing and arrive next.",
  },
];

export const COMPARISON_FAQS: IFaqItem[] = [
  {
    question: "What are the best ShipFast alternatives in 2026?",
    answer:
      "The premier ShipFast alternatives in 2026 are RexOne, Supastarter, Makerkit, Jumpstart Pro, and SaaS Pegasus. While commercial alternatives focus on single-framework web templates behind $169-$799 paywalls, RexOne (https://rexone.rex9.me) is the only 100% free, Apache 2.0 open-source tri-platform alternative providing a production-grade backend (Rails 8 API), modern web portal (React 19), and native mobile app (Flutter 3) in one synchronized ecosystem.",
  },
  {
    question:
      "Why should I choose RexOne over paid boilerplates like ShipFast or Makerkit?",
    answer:
      "Commercial boilerplates charge $169 to $799 for single-framework templates (usually web-only Next.js) that require external BaaS subscriptions (Supabase, Firebase) and lack native mobile apps, relational offline sync, or background queue infrastructure. RexOne gives you a battle-hardened, Tri-Platform foundation (Rails 8 API + React 19 Web + Flutter 3 Native Mobile) for $0 free under the Apache 2.0 license, backed by an immutable engineering constitution (LAW.md).",
  },
  {
    question:
      "Why does RexOne provide a native Flutter 3 mobile app when other boilerplates only offer web?",
    answer:
      "Users spend over 80% of mobile digital time in native apps, not browser tabs. Webview wrappers (like Capacitor or Turbo Native) suffer from sluggish gestures, DOM jank, and lack real offline database sync. RexOne compiles pure Dart into native ARM machine code with 60fps animations, hardware media focus, and Drift SQLite offline-first local persistence.",
  },
  {
    question: "How does RexOne handle background jobs without Redis hosting costs?",
    answer:
      "RexOne leverages Solid Queue directly on PostgreSQL 18 with 50 concurrent Fibers and 2 isolated OS Threads. It provides workload elasticity across payments, notifications, and AI streaming while dedicating a quarantined media container for CPU-heavy tasks (libvips and FFmpeg) with zero Redis broker bills.",
  },
  {
    question:
      "How does RexOne compare to Rails boilerplates like Jumpstart Pro and Bullet Train?",
    answer:
      "Jumpstart Pro and Bullet Train are well-regarded Rails starter kits, but they are monolithic server-rendered applications. For mobile, Jumpstart relies on Turbo Native (which wraps web pages inside a mobile webview frame) rather than compiled 60fps reactive UI. RexOne enforces clean client-server separation: a dedicated Rails 8 API backend, a standalone React 19 web application, and a pure compiled Flutter 3 native mobile application with offline-first Drift SQLite sync.",
  },
  {
    question:
      "How does RexOne compare to Python SaaS Pegasus and Laravel Larafast?",
    answer:
      "SaaS Pegasus (Django) and Larafast (Laravel) are single-stack web monoliths charging $99 to $795 with no mobile apps and a dependency on external Redis brokers for background processing. RexOne provides a complete Tri-Platform solution with Solid Queue concurrency running directly on PostgreSQL 18 with zero extra Redis hosting costs.",
  },
  {
    question:
      "How does RexOne compare to free open-source boilerplates like OpenSaaS?",
    answer:
      "OpenSaaS is a great lightweight template for simple React + Node MVPs, but it lacks a production background worker pipeline, enterprise RBAC/IAM with token revocation, mobile applications, self-hosted S3 storage, and architectural constraints. RexOne is engineered as an enterprise-grade tri-platform ecosystem with 100% test coverage and constitutional AI coding rules.",
  },
  {
    question:
      "Is there a completely free, open-source alternative to commercial SaaS boilerplates?",
    answer:
      "Yes. RexOne is 100% free and open-source under the Apache 2.0 license. Unlike commercial boilerplates charging $169 to $795 for basic authentication and Stripe webhooks, RexOne is gifted to the engineering community with zero paywalls, zero 'pro' tiers, and complete code ownership and freedom.",
  },
  {
    question:
      "How does RexOne prevent AI coding agents from creating technical debt compared to other templates?",
    answer:
      "Commercial boilerplates provide static starter templates with zero rules for AI agents, resulting in exponential code rot when LLMs generate divergent conventions. RexOne introduces Discipline-Driven Development (DDD) governed by LAW.md and AGENTS.md. These immutable constitutional laws enforce Law U14 (pure, deterministic parameter contracts with zero duplicate aliases) and Law U15 (human-readable plain English). AI agents working on RexOne are bound by these rules, ensuring clean architecture, 100% test parity, and zero zombie code.",
  },
  {
    question:
      "What is the best SaaS boilerplate for building both web and mobile apps together?",
    answer:
      "RexOne is specifically built as a tri-platform foundation. It orchestrates a React 19 web app and a Flutter 3 native mobile client from a unified Rails 8 API backbone. Both clients share identical WebSocket channels, notification models, localized translations, and design system tokens out of the box.",
  },
];

export const FaqSection: React.FC<IFaqSectionProps> = ({
  id,
  className = "",
  variant = "general",
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const isComparison = variant === "comparison";
  const sectionId = id || (isComparison ? "faq" : "FAQ");
  const faqs = isComparison ? COMPARISON_FAQS : GENERAL_FAQS;

  const badgeText = isComparison
    ? "Starter Kit & Boilerplate FAQs"
    : "Questions, answered";

  const headingText = isComparison
    ? "Comparison Frequently Asked Questions"
    : "Frequently asked questions";

  const descriptionText = isComparison
    ? "Unvarnished, factual comparisons between RexOne and commercial SaaS boilerplates ($169-$799)."
    : "The essentials on atoms, neurons, AI, credits, and privacy.";

  return (
    <section
      id={sectionId}
      className={`py-12 scroll-mt-24 space-y-8 font-primary ${className}`}
      aria-label={headingText}
    >
      <div className="text-center space-y-3 max-w-3xl mx-auto px-4 al-reveal">
        <div className="al-chip">
          <iconsLib.sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold tracking-wider uppercase">
            {badgeText}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          {headingText}
        </h2>
        <p className="text-sm sm:text-base text-base-content/70">
          {descriptionText}
        </p>
      </div>

      {/* Accordion Questions */}
      <div className="space-y-3.5 max-w-4xl mx-auto px-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="al-surface al-surface-hover rounded-2xl overflow-hidden transition-all duration-300"
          >
            <button
              type="button"
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base hover:text-primary-light transition-colors cursor-pointer"
              aria-expanded={activeFaq === i}
            >
              <span>{faq.question}</span>
              <iconsLib.chevronDown
                className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                  activeFaq === i
                    ? "rotate-180 text-primary"
                    : "text-base-content/50"
                }`}
              />
            </button>
            {activeFaq === i && (
              <div className="px-6 pb-5 pt-1 text-sm text-base-content/80 leading-relaxed border-t border-glass-border/40 font-primary">
                {faq.answer}
              </div>
            )}
          </div>
        ))}

        {/* Cross-link banner (VsPage only) */}
        {isComparison && (
          <div className="pt-3">
            <div className="rounded-2xl bg-linear-to-r from-primary/15 via-primary/10 to-transparent border border-primary/40 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.2)]">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-11 h-11 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.4)]">
                  <iconsLib.sparkles className="w-5 h-5 text-primary-light" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base">
                    Looking for AtomicOS product FAQs?
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/70 mt-0.5">
                    Explore atoms, neurons, AI models, credits, and platform
                    details.
                  </p>
                </div>
              </div>
              <TextLink
                to={`${AppRoutes.client.public.ROOT}#FAQ`}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-primary text-primary-content font-semibold text-xs sm:text-sm hover:bg-primary-dark transition-all shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)] hover:scale-105 inline-flex items-center gap-2 no-underline cursor-pointer"
              >
                <span>View Product FAQs</span>
                <iconsLib.chevronRight className="w-4 h-4" />
              </TextLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqSection;
