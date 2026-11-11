// src/modules/landing/components/HeroSection.tsx

import React from "react";
import { iconsLib } from "../../../assets";
import { Button, ButtonVariants, ComponentSizes } from "../../../design";
import { useOpenApp } from "../helpers";

const TURNS = [
  {
    speaker: "Speaker 1",
    tone: "1",
    text: "Okay team — the pricing experiment closed with a 12% lift.",
  },
  {
    speaker: "Speaker 2",
    tone: "2",
    text: "Great. Let's ship the annual plan at eight dollars a month.",
  },
  {
    speaker: "Speaker 3",
    tone: "3",
    text: "I'll draft the changelog entry and brief support by Friday.",
  },
];

const SUMMARY_POINTS = [
  "Annual plan at $8/mo approved",
  "Changelog + support handoff assigned",
  "Follow-up review on Friday",
];

/**
 * Hero visual: a product screenshot composed in the DOM (not a bitmap) so it
 * stays crisp, stays on-brand, and shows the actual product moment — a live
 * meeting captured, speaker-labelled, summarized, and queryable.
 */
const ProductShowcase: React.FC = () => (
  <div
    className="relative flex items-center justify-center py-7 sm:py-4"
    aria-hidden="true"
  >
    <div className="al-hero-glow" />

    <div className="al-shot-frame">
      <div className="al-shot">
        {/* Window chrome */}
        <div className="al-shot-bar">
          <div className="flex items-center gap-2">
            <span className="al-shot-dot" />
            <span className="al-shot-dot" />
            <span className="al-shot-dot" />
            <span className="ml-2 text-[11.5px] font-bold tracking-wide text-base-content/75">
              AtomicOS
            </span>
          </div>
          <span className="al-live-pill">
            <span className="al-live-dot" />
            Live · 12:48
          </span>
        </div>

        <div className="al-shot-body">
          {/* Meeting header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[13.5px] font-bold">
              <span className="al-shot-icon">
                <iconsLib.microphone className="w-3.5 h-3.5" />
              </span>
              Weekly product sync
            </div>
            <div className="al-wave">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          {/* Speaker-labelled transcript */}
          <div className="mt-4 space-y-3">
            {TURNS.map((turn) => (
              <div key={turn.text} className="flex items-start gap-2.5">
                <span className={`al-speaker al-speaker-${turn.tone}`}>
                  {turn.speaker}
                </span>
                <p className="text-[13.5px] leading-relaxed text-base-content/95">
                  {turn.text}
                </p>
              </div>
            ))}
          </div>

          {/* Summary card */}
          <div className="al-shot-summary">
            <div className="flex items-center gap-2">
              <iconsLib.sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-primary">
                Summary ready
              </span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {SUMMARY_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-[12.5px] text-base-content/90"
                >
                  <iconsLib.check className="mt-[1px] w-3 h-3 shrink-0 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Ask-anything row — part of the product, not an overlay */}
          <div className="al-ask-row">
            <div className="al-ask-input">
              <iconsLib.sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[12px] text-base-content/60">
                Ask anything about this meeting…
              </span>
              <span className="al-send">
                <iconsLib.arrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="al-ask-answer">
              <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-primary">
                Answer
              </span>
              <p className="mt-0.5 text-[12.5px] leading-snug text-base-content/95">
                Annual plan at $8/mo — shipping Friday.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating status chips — kept off the screenshot content */}
      <div className="al-hero-chip al-hero-chip-a al-float">
        <iconsLib.userGroup className="h-3.5 w-3.5 text-primary" />
        3 speakers detected
      </div>

      <div
        className="al-hero-chip al-hero-chip-b al-float-slow"
        style={{ animationDelay: "1.2s" }}
      >
        <iconsLib.cube className="h-3.5 w-3.5 text-primary" />
        Atom created
      </div>
    </div>
  </div>
);

export const HeroSection: React.FC = () => {
  const openApp = useOpenApp();

  return (
    <section
      id="Home"
      className="relative scroll-mt-24 pt-14 sm:pt-20 pb-10 sm:pb-14"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Copy */}
        <div className="lg:col-span-6 text-center lg:text-left space-y-6">
          <div className="al-enter al-chip">
            <iconsLib.sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-[0.14em] uppercase">
              AI-powered workspace
            </span>
          </div>

          <h1 className="al-enter al-enter-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.06]">
            Capture <span className="text-primary">atoms.</span>
            <br />
            Ask anything.
          </h1>

          <p className="al-enter al-enter-delay-2 text-base sm:text-lg text-base-content/75 leading-relaxed max-w-[52ch] mx-auto lg:mx-0">
            The AI workspace where your notes, meetings, and files become atoms
            you can ask anything about.
          </p>

          <div className="al-enter al-enter-delay-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
            <Button
              variant={ButtonVariants.PRIMARY}
              size={ComponentSizes.LG}
              onClick={openApp}
              className="w-full sm:w-auto bg-primary! border-primary! text-primary-content! font-bold px-7! shadow-[0_6px_30px_rgba(var(--color-primary-rgb),0.25)] hover:bg-primary-dark! hover:border-primary-dark! hover:text-white!"
            >
              Open the app
              <iconsLib.arrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              href="#Features"
              variant={ButtonVariants.TERTIARY}
              size={ComponentSizes.LG}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("Features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto bg-glass-card! border! border-glass-border! font-semibold px-7! hover:bg-glass-card-hover! hover:border-glass-border-hover!"
            >
              Explore features
            </Button>
          </div>
        </div>

        {/* Visual: the product, mid-meeting */}
        <div className="lg:col-span-6">
          <ProductShowcase />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
