// src/modules/landing/components/SupportCta.tsx

import React from "react";
import { iconsLib } from "../../../assets";
import { Button, ButtonVariants, ComponentSizes } from "../../../design";
import { useOpenApp } from "../helpers";
import { LANDING_DATA } from "../constants";

export const SupportCta: React.FC<{ id?: string }> = ({ id = "Support" }) => {
  const openApp = useOpenApp();

  return (
    <section id={id} className="py-12 sm:py-16 scroll-mt-24">
      <div className="al-bento-a border border-glass-border rounded-3xl px-6 py-12 sm:py-16 text-center space-y-6 al-reveal">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Start with one atom.
        </h2>
        <p className="text-sm sm:text-base text-base-content/70 leading-relaxed max-w-[46ch] mx-auto">
          Create your workspace in a minute. Capture the first thing that
          matters, then let AI take it from there.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant={ButtonVariants.PRIMARY}
            size={ComponentSizes.LG}
            onClick={openApp}
            className="w-full sm:w-auto bg-primary! border-primary! text-primary-content! font-bold px-7! shadow-[0_6px_30px_rgba(var(--color-primary-rgb),0.25)] hover:bg-primary-dark! hover:border-primary-dark! hover:text-white!"
          >
            Open the app
          </Button>
          <Button
            href={`mailto:${LANDING_DATA.supportEmail}`}
            variant={ButtonVariants.TERTIARY}
            size={ComponentSizes.LG}
            className="w-full sm:w-auto bg-glass-card! border! border-glass-border! font-semibold px-7! hover:bg-glass-card-hover! hover:border-glass-border-hover!"
          >
            <iconsLib.mail className="w-4 h-4 mr-2" />
            Talk to us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SupportCta;
