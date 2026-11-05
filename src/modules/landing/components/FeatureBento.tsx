// src/modules/landing/components/FeatureBento.tsx

import React from "react";
import { brand, iconsLib } from "../../../assets";
import { Asset } from "../../../design";

interface IFeatureCell {
  id: string;
  icon: keyof typeof iconsLib;
  title: string;
  text: string;
  className: string;
  variant?: "gradient" | "plain";
  tags?: string[];
}

const FEATURE_CELLS: IFeatureCell[] = [
  {
    id: "atoms",
    icon: "document",
    title: "Atoms, the unit of everything",
    text: "Every note, file, recording, and meeting lands as one titled, dated, categorized atom that AI can read.",
    className: "md:col-span-2",
    variant: "gradient",
  },
  {
    id: "neurons",
    icon: "cube",
    title: "Neurons keep it organized",
    text: "Fold atoms into neurons that map your projects, clients, and ideas. Context stays in place.",
    className: "",
    tags: ["Projects", "Clients", "Ideas"],
  },
  {
    id: "ask",
    icon: "sparkles",
    title: "Chat with your workspace",
    text: "Ask about one atom, a whole neuron, or everything at once. The AI answers with your context in mind.",
    className: "",
  },
  {
    id: "transcribe",
    icon: "microphone",
    title: "Live transcribe",
    text: "Watch speech become text in real time during a meeting, then keep the transcript as an atom.",
    className: "",
    variant: "plain",
  },
  {
    id: "meetings",
    icon: "clock",
    title: "Meetings that summarize themselves",
    text: "Set a meeting date and record as you talk. When it ends, an AI summary is waiting for you.",
    className: "",
  },
];

export const FeatureBento: React.FC<{ id?: string }> = ({ id = "Features" }) => {
  return (
    <section id={id} className="py-12 sm:py-16 scroll-mt-24">
      <div className="max-w-3xl mb-9 space-y-3 al-reveal">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Everything your work needs.
        </h2>
        <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
          Capture, organize, transcribe, summarize, and ask. One workspace for
          all of it, on every device you carry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURE_CELLS.map((cell) => {
          const Icon = iconsLib[cell.icon] || iconsLib.cube;
          return (
            <div
              key={cell.id}
              className={`relative overflow-hidden rounded-2xl p-6 sm:p-7 flex flex-col gap-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-glass-border-hover ${
                cell.variant === "gradient"
                  ? "al-bento-a border border-glass-border"
                  : "al-surface al-surface-hover"
              } ${cell.className} al-reveal`}
            >
              <div className="al-tile w-11 h-11 rounded-xl flex items-center justify-center">
                <Icon className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">{cell.title}</h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                {cell.text}
              </p>

              {cell.variant === "gradient" && (
                <div className="flex flex-wrap gap-2 mt-auto pt-3">
                  {[
                    { icon: iconsLib.document, label: "Note" },
                    { icon: iconsLib.microphone, label: "Recording" },
                    { icon: iconsLib.photo, label: "Screenshot" },
                    { icon: iconsLib.clock, label: "Meeting" },
                  ].map((format) => (
                    <span
                      key={format.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-glass-card px-3 py-1 text-[11px] font-semibold text-base-content/80"
                    >
                      <format.icon className="w-3.5 h-3.5 text-primary" />
                      {format.label}
                    </span>
                  ))}
                </div>
              )}

              {cell.tags && (
                <div className="flex flex-wrap gap-2 mt-auto pt-3">
                  {cell.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-glass-border bg-glass-card px-3 py-1 text-[11px] font-medium text-base-content/75"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {cell.variant === "plain" && (
                <div className="al-eq mt-auto pt-2" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              )}

              {cell.variant === "gradient" && (
                <Asset
                  asset={brand.mark}
                  showLoadingPlaceholder={false}
                  className="pointer-events-none absolute! -right-10 -bottom-12 w-56 h-56 opacity-[0.14] rotate-12"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureBento;
