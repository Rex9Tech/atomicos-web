// src/modules/landing/components/PlatformsSection.tsx

import React from "react";
import { brand, iconsLib } from "../../../assets";
import { Asset, Button, ButtonVariants, ComponentSizes } from "../../../design";
import { useOpenApp } from "../helpers";

export const PlatformsSection: React.FC<{ id?: string }> = ({
  id = "Platforms",
}) => {
  const openApp = useOpenApp();

  return (
    <section id={id} className="py-12 sm:py-16 scroll-mt-24">
      <div className="max-w-3xl mb-9 space-y-3 al-reveal">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          One workspace, every screen.
        </h2>
        <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
          Start an atom on your phone, finish it on the web. Everything stays in
          sync in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Web: live today */}
        <div className="al-bento-a border border-glass-border rounded-2xl p-6 sm:p-8 flex flex-col gap-5 al-reveal">
          <div className="flex items-center justify-between gap-3">
            <div className="al-tile w-11 h-11 rounded-xl flex items-center justify-center">
              <iconsLib.computerDesktop className="w-5.5 h-5.5" />
            </div>
            <span className="al-chip text-primary!">Live now</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight">Web app</h3>
            <p className="text-sm text-base-content/70 leading-relaxed max-w-[48ch]">
              Runs in your browser. No install, no waiting: open it and your
              workspace is right there.
            </p>
          </div>

          <Button
            variant={ButtonVariants.PRIMARY}
            size={ComponentSizes.MD}
            onClick={openApp}
            className="self-start bg-primary! border-primary! text-primary-content! font-bold px-6! hover:bg-primary-dark! hover:border-primary-dark! hover:text-white!"
          >
            Open the app
            <iconsLib.externalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Native apps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="al-surface al-surface-hover rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 al-reveal">
            <div className="flex items-center justify-between gap-3">
              <Asset
                asset={brand.appIcon}
                showLoadingPlaceholder={false}
                className="w-11 h-11 rounded-xl"
              />
              <span className="text-[11px] font-bold tracking-wider uppercase text-base-content/50">
                iOS
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold tracking-tight">Native iOS app</h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Built for touch, with your atoms close at hand.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-base-content/60 mt-auto">
              In final testing
            </span>
          </div>

          <div className="al-surface al-surface-hover rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 al-reveal">
            <div className="flex items-center justify-between gap-3">
              <Asset
                asset={brand.appIcon}
                showLoadingPlaceholder={false}
                className="w-11 h-11 rounded-xl"
              />
              <span className="text-[11px] font-bold tracking-wider uppercase text-base-content/50">
                Android
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold tracking-tight">Native Android app</h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                The same workspace, tuned for Android from the ground up.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-base-content/60 mt-auto">
              In final testing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformsSection;
