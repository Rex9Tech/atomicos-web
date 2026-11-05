// src/modules/landing/components/CapabilityStrip.tsx

import React from "react";
import { iconsLib } from "../../../assets";

interface ICapability {
  icon: keyof typeof iconsLib;
  label: string;
  text: string;
}

const CAPABILITIES: ICapability[] = [
  {
    icon: "document",
    label: "Capture",
    text: "Notes, files, and recordings land as atoms.",
  },
  {
    icon: "cube",
    label: "Organize",
    text: "Neurons group atoms by project or topic.",
  },
  {
    icon: "sparkles",
    label: "Ask",
    text: "Chat with any atom, neuron, or everything.",
  },
  {
    icon: "microphone",
    label: "Transcribe",
    text: "Live meeting audio becomes searchable text.",
  },
];

export const CapabilityStrip: React.FC = () => {
  return (
    <section className="py-8 sm:py-10">
      <div className="al-surface rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-glass-border/50">
        {CAPABILITIES.map((capability) => {
          const Icon = iconsLib[capability.icon] || iconsLib.cube;
          return (
            <div
              key={capability.label}
              className="flex items-start gap-3.5 px-5 py-5 sm:py-6"
            >
              <div className="al-tile w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-sm tracking-wide">
                  {capability.label}
                </p>
                <p className="text-xs text-base-content/70 leading-relaxed">
                  {capability.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CapabilityStrip;
