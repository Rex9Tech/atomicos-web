// src/modules/landing/components/LandingFooter.tsx

import React from "react";
import { brand, iconsLib } from "../../../assets";
import { Asset, TextLink } from "../../../design";
import AppRoutes from "../../../AppRoutes";
import { LANDING_DATA } from "../constants";

export type LandingFooterPage = "home" | "vs" | "privacy" | "terms";

export interface ILandingFooterProps {
  activePage?: LandingFooterPage;
}

export const LandingFooter: React.FC<ILandingFooterProps> = ({
  activePage = "home",
}) => {
  const homeAnchor = (hash: string) =>
    activePage === "home" ? hash : `${AppRoutes.client.public.ROOT}${hash}`;

  const anchorClass =
    "text-base-content/60 hover:text-primary transition-colors text-xs tracking-wide no-underline hover:no-underline";

  return (
    <div className="w-full">
      {/* Glowing divider */}
      <div className="w-4/5 max-w-5xl h-px mx-auto my-10 bg-linear-to-r from-transparent via-primary/60 to-transparent" />

      <footer className="pb-16 space-y-7">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Asset
              asset={brand.appIcon}
              showLoadingPlaceholder={false}
              className="h-8 w-8 rounded-[9px]"
            />
            <span className="font-primary text-lg font-bold tracking-tight">
              Atomic<span className="text-primary font-extrabold">OS</span>
            </span>
          </div>
          <p className="text-xs text-base-content/50 text-center max-w-md leading-relaxed">
            The AI workspace for your notes, meetings, and files. Capture atoms,
            organize with neurons, ask anything.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs font-medium">
          <a href={homeAnchor("#Features")} className={anchorClass}>
            Features
          </a>
          <a href={homeAnchor("#Platforms")} className={anchorClass}>
            Platforms
          </a>
          <a href={homeAnchor("#FAQ")} className={anchorClass}>
            FAQ
          </a>
          <a href={homeAnchor("#Support")} className={anchorClass}>
            Support
          </a>
          <TextLink
            to={AppRoutes.client.public.PRIVACY_POLICY}
            className={`${anchorClass} ${
              activePage === "privacy" ? "text-primary! font-bold" : ""
            }`}
          >
            Privacy Policy
          </TextLink>
          <TextLink
            to={AppRoutes.client.public.TERMS_AND_CONDITIONS}
            className={`${anchorClass} ${
              activePage === "terms" ? "text-primary! font-bold" : ""
            }`}
          >
            Terms &amp; Conditions
          </TextLink>
        </div>

        {/* Contact + Copyright */}
        <div className="text-center space-y-2">
          <a
            href={`mailto:${LANDING_DATA.supportEmail}`}
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
          >
            <iconsLib.mail className="w-3.5 h-3.5" />
            {LANDING_DATA.supportEmail}
          </a>
          <p className="text-xs text-base-content/55">
            © {new Date().getFullYear()} AtomicOS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingFooter;
