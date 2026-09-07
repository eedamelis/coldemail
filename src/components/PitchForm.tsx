import React from "react";
import { OutreachAngleOption } from "../types";
import {
  Send,
  RotateCcw,
  AlertCircle,
  Loader2,
  Building2,
  Briefcase,
  Target,
  ChevronDown,
} from "lucide-react";

export const OUTREACH_ANGLES: OutreachAngleOption[] = [
  {
    id: "pain_point",
    label: "Pain Point Relief — Solve explicit bottlenecks or delays",
    tagline: "Solve explicit friction",
    description:
      "Pinpoints specific bottlenecks, manual delays, or challenges stated in their copy and solves them directly.",
  },
  {
    id: "strategic_synergy",
    label: "Strategic Synergy — Align with expansion & roadmap moves",
    tagline: "Growth & product alignment",
    description:
      "Aligns directly with their stated expansion plans, market entries, or new customer segment initiatives.",
  },
  {
    id: "efficiency_roi",
    label: "Speed & Efficiency — Save measurable hours & operational costs",
    tagline: "Save measurable time/money",
    description:
      "Highlights rapid turnaround, automated workflows, and quantifiable operational return on investment.",
  },
  {
    id: "differentiation",
    label: "Competitive Edge — Outpace industry competitors",
    tagline: "Outpace market rivals",
    description:
      "Positions your offering as the unfair advantage that helps them out-execute rival competitors.",
  },
  {
    id: "founder_vision",
    label: "Founder & Mission — Anchor in values & origin story",
    tagline: "Values & founding ethos",
    description:
      "Anchors the conversation in their origin narrative, brand philosophy, or customer commitment.",
  },
  {
    id: "custom",
    label: "Custom Angle — Define a specific thesis or angle",
    tagline: "Specific hook or thesis",
    description:
      "Provide your own bespoke angle or value hook to tailor the pitch exactly to your thesis.",
  },
];

interface PitchFormProps {
  companyText: string;
  onCompanyTextChange: (val: string) => void;
  offering: string;
  onOfferingChange: (val: string) => void;
  selectedAngle: string;
  onSelectAngle: (val: string) => void;
  customAngleText: string;
  onCustomAngleTextChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onReset: () => void;
  errorMessage?: string | null;
}

export const PitchForm: React.FC<PitchFormProps> = ({
  companyText,
  onCompanyTextChange,
  offering,
  onOfferingChange,
  selectedAngle,
  onSelectAngle,
  customAngleText,
  onCustomAngleTextChange,
  onSubmit,
  isLoading,
  onReset,
  errorMessage,
}) => {
  const currentAngleObj =
    OUTREACH_ANGLES.find((a) => a.id === selectedAngle) || OUTREACH_ANGLES[0];
  const trimmed = companyText.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 sm:space-y-5"
      id="pitch-generator-form"
    >
      {/* Card 1: Target Company Intel Textarea */}
      <div
        id="card-input-company-intel"
        className="rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824] p-5 sm:p-6 shadow-xs space-y-3 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3E5C52]/10 dark:bg-[#3E5C52]/20 text-[#3E5C52] dark:text-[#7BA597] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <label
                htmlFor="company-text"
                className="block text-sm sm:text-base font-bold text-[#1B2B24] dark:text-[#EDEAE5] leading-none"
              >
                Target Company Intel
              </label>
              <p className="text-xs text-[#7A7169] dark:text-[#A8A199] mt-1">
                Paste About Us page, mission statement, recent press release, or
                job description
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FAF9F7] dark:bg-[#18221E] border border-[#E0D7D0] dark:border-[#2C3933] text-[#7A7169] dark:text-[#A8A199] shrink-0">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        </div>

        <div className="relative">
          <textarea
            id="company-text"
            value={companyText}
            onChange={(e) => onCompanyTextChange(e.target.value)}
            disabled={isLoading}
            placeholder="Paste raw target company copy here (e.g. 'At Acme Logistics, we manage multi-modal freight across 400 brands. However, manual customs documentation has caused warehouse cross-dock delays...')"
            rows={5}
            className="w-full text-sm sm:text-base px-4 py-3.5 rounded-xl border border-[#E0D7D0] dark:border-[#2C3933] bg-[#FAF9F7] dark:bg-[#18221E] text-[#1B2B24] dark:text-[#EDEAE5] placeholder:text-[#A8A199] focus:outline-none focus:ring-2 focus:ring-[#3E5C52]/30 focus:border-[#3E5C52] transition-all resize-y min-h-[130px] leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
            required
          />
        </div>
      </div>

      {/* Card 2: Your Offering / Capability Input */}
      <div
        id="card-input-offering"
        className="rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824] p-5 sm:p-6 shadow-xs space-y-3 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3E5C52]/10 dark:bg-[#3E5C52]/20 text-[#3E5C52] dark:text-[#7BA597] flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <label
              htmlFor="offering-input"
              className="block text-sm sm:text-base font-bold text-[#1B2B24] dark:text-[#EDEAE5] leading-none"
            >
              Your Offering / Capability
            </label>
            <p className="text-xs text-[#7A7169] dark:text-[#A8A199] mt-1">
              Briefly describe your solution, product, or service that can help
              them
            </p>
          </div>
        </div>

        <div className="relative">
          <input
            id="offering-input"
            type="text"
            value={offering}
            onChange={(e) => onOfferingChange(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. DocuSwift AI — automates freight clearance manifests in 4 minutes instead of 48 hours"
            className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#E0D7D0] dark:border-[#2C3933] bg-[#FAF9F7] dark:bg-[#18221E] text-[#1B2B24] dark:text-[#EDEAE5] placeholder:text-[#A8A199] focus:outline-none focus:ring-2 focus:ring-[#3E5C52]/30 focus:border-[#3E5C52] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            required
          />
        </div>
      </div>

      {/* Card 3: Outreach Angle Dropdown */}
      <div
        id="card-input-angle"
        className="rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824] p-5 sm:p-6 shadow-xs space-y-3 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3E5C52]/10 dark:bg-[#3E5C52]/20 text-[#3E5C52] dark:text-[#7BA597] flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <label
              htmlFor="outreach-angle-select"
              className="block text-sm sm:text-base font-bold text-[#1B2B24] dark:text-[#EDEAE5] leading-none"
            >
              Outreach Angle
            </label>
            <p className="text-xs text-[#7A7169] dark:text-[#A8A199] mt-1">
              Select how to frame your pitch and position mutual value
            </p>
          </div>
        </div>

        <div className="relative">
          <select
            id="outreach-angle-select"
            value={selectedAngle}
            onChange={(e) => onSelectAngle(e.target.value)}
            disabled={isLoading}
            className="w-full text-sm sm:text-base px-4 py-3.5 pr-10 rounded-xl border border-[#E0D7D0] dark:border-[#2C3933] bg-[#FAF9F7] dark:bg-[#18221E] text-[#1B2B24] dark:text-[#EDEAE5] focus:outline-none focus:ring-2 focus:ring-[#3E5C52]/30 focus:border-[#3E5C52] transition-all appearance-none cursor-pointer font-medium disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {OUTREACH_ANGLES.map((angle) => (
              <option
                key={angle.id}
                value={angle.id}
                className="bg-white dark:bg-[#1E2824] text-[#1B2B24] dark:text-[#EDEAE5]"
              >
                {angle.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-[#7A7169] dark:text-[#A8A199]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Selected Angle Helper Description */}
        {currentAngleObj && (
          <div className="p-3.5 rounded-xl bg-[#F0F7F4] dark:bg-[#23352E]/60 border border-[#3E5C52]/20 text-xs text-[#3E5C52] dark:text-[#7BA597] flex items-start gap-2">
            <span className="font-bold shrink-0 uppercase tracking-wider text-[10px] mt-0.5 px-1.5 py-0.5 rounded bg-[#3E5C52]/10 dark:bg-[#3E5C52]/30">
              Focus
            </span>
            <span className="leading-relaxed">
              {currentAngleObj.description}
            </span>
          </div>
        )}

        {/* Custom Angle Input if selected */}
        {selectedAngle === "custom" && (
          <div className="pt-1">
            <input
              type="text"
              id="custom-angle-input"
              value={customAngleText}
              onChange={(e) => onCustomAngleTextChange(e.target.value)}
              disabled={isLoading}
              placeholder="Describe your custom angle or hook thesis..."
              className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#3E5C52]/40 dark:border-[#3E5C52]/60 bg-[#FAF9F7] dark:bg-[#18221E] text-[#1B2B24] dark:text-[#EDEAE5] placeholder:text-[#A8A199] focus:outline-none focus:ring-2 focus:ring-[#3E5C52]/30 disabled:opacity-75 disabled:cursor-not-allowed"
              required
            />
          </div>
        )}
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          id="generate-pitch-btn"
          disabled={isLoading || !trimmed || !offering.trim()}
          className="flex-1 py-4 px-6 rounded-2xl bg-[#3E5C52] hover:bg-[#2F463E] disabled:bg-[#E0D7D0] dark:disabled:bg-[#283832] disabled:text-[#7A7169] dark:disabled:text-[#65736C] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer disabled:cursor-not-allowed min-h-[52px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Intel & Generating Pitch...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Generate Pitch</span>
            </>
          )}
        </button>

        {(trimmed || offering.trim()) && !isLoading && (
          <button
            type="button"
            onClick={onReset}
            id="reset-form-btn"
            className="p-3.5 rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] text-[#7A7169] dark:text-[#A8A199] hover:bg-[#FAF9F7] dark:hover:bg-[#18221E] hover:text-[#1B2B24] dark:hover:text-[#EDEAE5] transition-colors cursor-pointer shrink-0"
            title="Clear all fields"
            aria-label="Clear form"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};
