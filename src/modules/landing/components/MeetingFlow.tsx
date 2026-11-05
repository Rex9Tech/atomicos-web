// src/modules/landing/components/MeetingFlow.tsx

import React from "react";
import { iconsLib } from "../../../assets";

interface IFlowStep {
  icon: keyof typeof iconsLib;
  title: string;
  text: string;
  highlighted?: boolean;
}

const FLOW_STEPS: IFlowStep[] = [
  {
    icon: "microphone",
    title: "Recording",
    text: "Go live during the meeting. Speech streams to text as you talk.",
  },
  {
    icon: "document",
    title: "Transcript",
    text: "The full transcript is saved as an atom, attached to the meeting.",
  },
  {
    icon: "sparkles",
    title: "Summary",
    text: "When you stop, AI writes the summary. Ask about it any time.",
    highlighted: true,
  },
];

export const MeetingFlow: React.FC = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Visual: the record to summary flow */}
        <div className="lg:col-span-6 order-2 lg:order-1">
          <div className="max-w-md mx-auto lg:mx-0 space-y-0">
            {FLOW_STEPS.map((step, idx) => {
              const Icon = iconsLib[step.icon] || iconsLib.cube;
              return (
                <React.Fragment key={step.title}>
                  <div
                    className={`rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 al-reveal ${
                      step.highlighted
                        ? "al-bento-a border border-glass-border"
                        : "al-surface al-surface-hover"
                    }`}
                  >
                    <div className="al-tile w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm tracking-wide">
                        {step.title}
                      </p>
                      <p className="text-xs text-base-content/70 leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                  {idx < FLOW_STEPS.length - 1 && (
                    <div
                      className="ml-9 h-6 border-l border-dashed border-glass-border"
                      aria-hidden="true"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-6 order-1 lg:order-2 space-y-4 al-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.12]">
            Transcribed as you talk. Summarized when you stop.
          </h2>
          <p className="text-sm sm:text-base text-base-content/70 leading-relaxed max-w-[56ch]">
            Go live and watch speech stream to text in real time. When the
            meeting ends, the recording, transcript, and AI summary stay
            together as one atom you can revisit, search, or ask about later.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MeetingFlow;
