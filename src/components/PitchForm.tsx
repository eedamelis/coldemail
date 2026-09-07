import React from 'react';
import { OutreachAngleOption } from '../types';
import { Send, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';

export const OUTREACH_ANGLES: OutreachAngleOption[] = [
  {
    id: 'pain_point',
    label: 'Pain Point Relief',
    tagline: 'Solve explicit friction',
    description: 'Pinpoints bottlenecks or delays stated in their copy and solves them directly.',
  },
  {
    id: 'strategic_synergy',
    label: 'Strategic Synergy',
    tagline: 'Growth & product alignment',
    description: 'Aligns with their expansion plans, roadmap milestones, or market moves.',
  },
  {
    id: 'efficiency_roi',
    label: 'Speed & Efficiency',
    tagline: 'Save measurable time/money',
    description: 'Highlights rapid turnaround, automated cycles, and immediate operational ROI.',
  },
  {
    id: 'differentiation',
    label: 'Competitive Edge',
    tagline: 'Outpace market rivals',
    description: 'Positions your offering as the unfair advantage helping them out-execute rivals.',
  },
  {
    id: 'founder_vision',
    label: 'Founder & Mission',
    tagline: 'Values & founding ethos',
    description: 'Anchors the conversation in their origin story, brand philosophy, or customer pledge.',
  },
  {
    id: 'custom',
    label: 'Custom Angle',
    tagline: 'Specific hook or thesis',
    description: 'Specify your own angle or custom thesis to target.',
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
  const currentAngleObj = OUTREACH_ANGLES.find((a) => a.id === selectedAngle);
  const wordCount = companyText.trim() ? companyText.trim().split(/\s+/).length : 0;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Target Company Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="company-text"
            className="text-xs font-bold uppercase tracking-widest text-[#7A7169] dark:text-[#A8A199]"
          >
            Target Company Context
          </label>
          <span className="text-xs font-medium text-[#7A7169] dark:text-[#A8A199]">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
        </div>
        <div className="relative">
          <textarea
            id="company-text"
            value={companyText}
            onChange={(e) => onCompanyTextChange(e.target.value)}
            placeholder="Paste target company text here (e.g. About Us page, mission statement, recent press release, job posting, or product overview)..."
            rows={5}
            className="w-full text-sm sm:text-base px-3.5 py-3 rounded-xl border border-[#E0D7D0] dark:border-[#2C3933] bg-[#FAF9F7] dark:bg-[#18221E] text-[#1B2B24] dark:text-[#EDEAE5] placeholder:text-[#A8A199] focus:outline-none focus:ring-2 focus:ring-[#3E5C52]/30 focus:border-[#3E5C52] transition-all resize-y min-h-[120px]"
            required
          />
        </div>
      </div>

      {/* Brief Offering Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="offering-input"
            className="text-xs font-bold uppercase tracking-widest text-[#7A7169] dark:text-[#A8A199]"
          >
            Your Offering / Capability
          </label>
        </div>
        <input
          id="offering-input"
          type="text"
          value={offering}
          onChange={(e) => onOfferingChange(e.target.value)}
          placeholder="e.g. AI-powered logistics optimization for sustainable brands"
          className="w-full text-sm sm:text-base px-3.5 py-2.5 rounded-xl border border-[#E0D7D0] dark:border-[#2C3933] bg-[#FAF9F7] dark:bg-[#18221E] text-[#1B2B24] dark:text-[#EDEAE5] placeholder:text-[#A8A199] focus:outline-none focus:ring-2 focus:ring-[#3E5C52]/30 focus:border-[#3E5C52] transition-all"
          required
        />
      </div>

      {/* Outreach Angle Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-[#7A7169] dark:text-[#A8A199]">
          Select Outreach Angle
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {OUTREACH_ANGLES.map((angle) => {
            const isSelected = selectedAngle === angle.id;
            return (
              <button
                type="button"
                key={angle.id}
                id={`angle-${angle.id}`}
                onClick={() => onSelectAngle(angle.id)}
                className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#3E5C52] bg-[#F0F7F4] dark:bg-[#23352E] text-[#1B2B24] dark:text-[#D1E4DC] shadow-xs'
                    : 'border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824] text-[#2D2D2D] dark:text-[#EDEAE5] hover:border-[#3E5C52]/50'
                }`}
              >
                <div className="text-xs font-semibold leading-tight line-clamp-1">
                  {angle.label}
                </div>
                <div className="text-[11px] text-[#7A7169] dark:text-[#A8A199] mt-1 leading-snug line-clamp-1">
                  {angle.tagline}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Angle Helper Description */}
        {currentAngleObj && selectedAngle !== 'custom' && (
          <p className="text-xs text-[#7A7169] dark:text-[#A8A199] pl-0.5">
            <span className="font-semibold text-[#1B2B24] dark:text-[#EDEAE5]">Focus:</span> {currentAngleObj.description}
          </p>
        )}

        {/* Custom Angle Input if selected */}
        {selectedAngle === 'custom' && (
          <div className="pt-1">
            <input
              type="text"
              id="custom-angle-input"
              value={customAngleText}
              onChange={(e) => onCustomAngleTextChange(e.target.value)}
              placeholder="Describe your custom angle or hook thesis..."
              className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-[#3E5C52]/40 dark:border-[#3E5C52]/60 bg-[#FAF9F7] dark:bg-[#18221E] text-[#1B2B24] dark:text-[#EDEAE5] placeholder:text-[#A8A199] focus:outline-none focus:ring-2 focus:ring-[#3E5C52]/30"
              required
            />
          </div>
        )}
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div
          id="pitch-error-alert"
          className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Generation Error</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          id="generate-pitch-btn"
          disabled={isLoading || !companyText.trim() || !offering.trim()}
          className="flex-1 py-3.5 px-5 rounded-xl bg-[#3E5C52] hover:bg-[#2F463E] disabled:bg-[#E0D7D0] dark:disabled:bg-[#283832] disabled:text-[#7A7169] dark:disabled:text-[#65736C] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer disabled:cursor-not-allowed min-h-[48px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing & Generating...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Generate Pitch</span>
            </>
          )}
        </button>

        {(companyText.trim() || offering.trim()) && !isLoading && (
          <button
            type="button"
            onClick={onReset}
            id="reset-form-btn"
            className="p-3 rounded-xl border border-[#E0D7D0] dark:border-[#2C3933] text-[#7A7169] dark:text-[#A8A199] hover:bg-[#FAF9F7] dark:hover:bg-[#18221E] hover:text-[#1B2B24] dark:hover:text-[#EDEAE5] transition-colors cursor-pointer"
            title="Clear all fields"
            aria-label="Clear form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};
