// src/modules/landing/components/LandingNav.tsx

import React, { useState } from "react";
import { brand, iconsLib } from "../../../assets";
import { Asset, Button, ButtonVariants, ComponentSizes, TextLink } from "../../../design";
import { isRex9LandingDomain, useOpenApp } from "../helpers";

export interface ILandingNavProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
  hideEnter?: boolean;
}

const NAV_ITEMS = [
  { label: "Features", href: "#Features" },
  { label: "Platforms", href: "#Platforms" },
  { label: "FAQ", href: "#FAQ" },
  { label: "Support", href: "#Support" },
];

export const LandingNav: React.FC<ILandingNavProps> = ({
  activeSection = "#Home",
  onSectionClick,
  hideEnter,
}) => {
  const openApp = useOpenApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shouldHideEnter = hideEnter ?? isRex9LandingDomain();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onSectionClick) {
      onSectionClick(href);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleOpenApp = () => {
    setIsMobileMenuOpen(false);
    openApp();
  };

  const brandMark = (
    <TextLink
      href="#Home"
      onClick={(e) => handleNavClick(e, "#Home")}
      className="flex items-center gap-2.5 no-underline select-none group text-base-content! hover:no-underline"
      aria-label="AtomicOS home"
    >
      <Asset
        asset={brand.appIcon}
        showLoadingPlaceholder={false}
        className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 select-none rounded-[10px] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_18px_rgba(var(--color-primary-rgb),0.28)]"
      />
      <span className="font-primary text-xl sm:text-2xl font-bold tracking-tight">
        Atomic<span className="text-primary font-extrabold">OS</span>
      </span>
    </TextLink>
  );

  const enterButton = (full: boolean) => (
    <Button
      variant={ButtonVariants.PRIMARY}
      size={ComponentSizes.SM}
      onClick={handleOpenApp}
      className={`bg-primary! border-primary! text-primary-content! font-bold hover:bg-primary-dark! hover:border-primary-dark! hover:text-white! shadow-[0_0_16px_rgba(var(--color-primary-rgb),0.3)] ${
        full ? "px-5! py-2!" : "py-1.5! px-4! text-xs!"
      }`}
    >
      Open app
    </Button>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-glass-nav backdrop-blur-xl border-b border-glass-border transition-all duration-300">
      <div className="max-w-7xl mx-auto h-16 sm:h-18 px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-between w-full">
          {brandMark}

          <div className="flex items-center space-x-6 lg:space-x-7 font-primary text-sm sm:text-[15px] font-medium text-base-content">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <TextLink
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`transition-colors duration-200 hover:no-underline ${
                    isActive
                      ? "text-primary! font-bold"
                      : "text-base-content/70! hover:text-white!"
                  }`}
                >
                  {item.label}
                </TextLink>
              );
            })}
          </div>

          {!shouldHideEnter && enterButton(true)}
        </nav>

        {/* Mobile Navigation Header */}
        <div className="flex md:hidden items-center justify-between w-full h-full">
          {brandMark}

          <div className="flex items-center gap-2">
            {!shouldHideEnter && enterButton(false)}

            <Button
              variant={ButtonVariants.TERTIARY}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1! text-base-content bg-transparent! border-0 shadow-none hover:bg-transparent! focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <iconsLib.close className="w-7 h-7 text-primary" />
              ) : (
                <iconsLib.menu className="w-7 h-7 text-primary" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-glass-nav backdrop-blur-2xl border-b border-glass-border-hover py-4 px-6">
          <div className="flex flex-col space-y-3 text-center font-primary text-base font-medium">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <TextLink
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`py-2 transition-colors duration-200 hover:no-underline ${
                    isActive
                      ? "text-primary! font-bold"
                      : "text-base-content/70! hover:text-white!"
                  }`}
                >
                  {item.label}
                </TextLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNav;
