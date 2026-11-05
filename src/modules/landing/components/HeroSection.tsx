// src/modules/landing/components/HeroSection.tsx

import React from "react";
import { brand, iconsLib } from "../../../assets";
import { Asset, Button, ButtonVariants, ComponentSizes } from "../../../design";
import { useOpenApp } from "../helpers";

export const HeroSection: React.FC = () => {
  const openApp = useOpenApp();

  return (
    <section
      id="Home"
      className="relative scroll-mt-24 pt-14 sm:pt-20 pb-10 sm:pb-14"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
        {/* Copy */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
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

        {/* Visual: the AtomicOS mark with orbital rings */}
        <div
          className="lg:col-span-5 relative flex items-center justify-center min-h-[320px] sm:min-h-[400px]"
          aria-hidden="true"
        >
          <div className="al-orbit al-spin w-[290px] h-[290px] sm:w-[360px] sm:h-[360px]">
            <span className="al-ring-dot" />
          </div>
          <div className="al-orbit al-orbit-2 al-spin-reverse w-[368px] h-[368px] sm:w-[460px] sm:h-[460px]" />
          <div className="al-halo w-[260px] h-[260px] sm:w-[330px] sm:h-[330px]" />

          <div className="al-float relative z-10">
            <Asset
              asset={brand.appIcon}
              showLoadingPlaceholder={false}
              className="al-app-icon w-44 h-44 sm:w-56 sm:h-56"
            />
          </div>

          <div className="al-chip al-float-slow absolute left-[6%] top-[14%] hidden sm:inline-flex">
            <iconsLib.plus className="w-3.5 h-3.5 text-primary" />
            New atom
          </div>
          <div
            className="al-chip al-float absolute right-[4%] bottom-[16%] hidden sm:inline-flex"
            style={{ animationDelay: "1.4s" }}
          >
            <iconsLib.microphone className="w-3.5 h-3.5 text-primary" />
            Live transcript
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
