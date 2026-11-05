// src/modules/landing/pages/LandingPage.tsx

import React, { useEffect, useState } from "react";
import {
  LandingNav,
  HeroSection,
  CapabilityStrip,
  FeatureBento,
  MeetingFlow,
  PlatformsSection,
  FaqSection,
  SupportCta,
  LandingFooter,
} from "../components";
import "../styles/landing.css";

export interface ILandingPageProps {
  hideEnter?: boolean;
}

const SECTION_IDS = ["Home", "Features", "Platforms", "FAQ", "Support"];

export const LandingPage: React.FC<ILandingPageProps> = ({ hideEnter }) => {
  const [activeSection, setActiveSection] = useState("#Home");

  // Scope the AtomicOS brand to this page and smooth-scroll to any hash target.
  useEffect(() => {
    const root = document.documentElement;
    const prevTheme = root.getAttribute("data-theme");
    const hadLandingPage = root.hasAttribute("data-page");

    root.setAttribute("data-page", "landing");
    root.setAttribute("data-theme", "night");

    if (window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }

    return () => {
      if (!hadLandingPage) {
        root.removeAttribute("data-page");
      }
      if (prevTheme) {
        root.setAttribute("data-theme", prevTheme);
      } else {
        root.removeAttribute("data-theme");
      }
    };
  }, []);

  // Track the active section for the navigation.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      data-page="landing"
      className="al-root min-h-screen w-full font-primary selection:bg-primary selection:text-primary-content"
    >
      <div className="al-bg" aria-hidden="true" />

      <div className="al-content">
        <LandingNav
          activeSection={activeSection}
          onSectionClick={handleScrollToSection}
          hideEnter={hideEnter}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <HeroSection />
          <CapabilityStrip />
          <FeatureBento />
          <MeetingFlow />
          <PlatformsSection />
          <FaqSection variant="general" className="my-8" />
          <SupportCta />
          <LandingFooter activePage="home" />
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
