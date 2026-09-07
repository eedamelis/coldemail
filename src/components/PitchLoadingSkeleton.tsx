import React from 'react';
import { Loader2, Sparkles, Building2, Mail } from 'lucide-react';

export const PitchLoadingSkeleton: React.FC = () => {
  return (
    <div
      id="pitch-loading-skeleton"
      className="space-y-5 animate-pulse"
      role="status"
      aria-label="Generating outreach pitch"
    >
      {/* Top Status Banner with Spinner */}
      <div className="rounded-2xl border border-[#3E5C52]/30 bg-[#F0F7F4] dark:bg-[#1C2E26] p-5 sm:p-6 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#3E5C52]/15 dark:bg-[#3E5C52]/30 text-[#3E5C52] dark:text-[#7BA597] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-[#1B2B24] dark:text-[#EDEAE5] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3E5C52] dark:text-[#7BA597]" />
            Crafting Evidence-Based Pitch
          </h3>
          <p className="text-xs sm:text-sm text-[#3E5C52] dark:text-[#7BA597] font-medium">
            Analyzing company intel • Isolating quotes • Writing 3-paragraph email
          </p>
        </div>
      </div>

      {/* Skeleton Card 1: Strategic Angle & Evidence */}
      <div className="rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EAE4DF] dark:bg-[#283832] flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[#A8A199] dark:text-[#65736C]" />
          </div>
          <div className="h-4 w-32 bg-[#EAE4DF] dark:bg-[#283832] rounded-md" />
        </div>

        {/* Angle Title Placeholder */}
        <div className="h-7 w-3/4 bg-[#EAE4DF] dark:bg-[#283832] rounded-lg" />

        {/* Evidence Snippet Placeholder */}
        <div className="p-4 rounded-xl bg-[#FAF9F7] dark:bg-[#18221E] border border-[#E0D7D0] dark:border-[#2C3933] space-y-2">
          <div className="h-3 w-28 bg-[#E0D7D0] dark:bg-[#2C3933] rounded" />
          <div className="h-4 w-full bg-[#EAE4DF] dark:bg-[#283832] rounded" />
          <div className="h-4 w-5/6 bg-[#EAE4DF] dark:bg-[#283832] rounded" />
        </div>

        {/* Rationale Placeholder */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3 w-20 bg-[#E0D7D0] dark:bg-[#2C3933] rounded" />
          <div className="h-4 w-11/12 bg-[#EAE4DF] dark:bg-[#283832] rounded" />
        </div>
      </div>

      {/* Skeleton Card 2: Outreach Email Draft */}
      <div className="rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EAE4DF] dark:bg-[#283832] flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#A8A199] dark:text-[#65736C]" />
            </div>
            <div className="h-4 w-40 bg-[#EAE4DF] dark:bg-[#283832] rounded-md" />
          </div>
          <div className="h-8 w-24 bg-[#EAE4DF] dark:bg-[#283832] rounded-lg" />
        </div>

        {/* Subject Line Bar Placeholder */}
        <div className="p-3.5 rounded-xl bg-[#FAF9F7] dark:bg-[#18221E] border border-[#E0D7D0] dark:border-[#2C3933] flex items-center gap-2">
          <div className="h-3 w-16 bg-[#E0D7D0] dark:bg-[#2C3933] rounded" />
          <div className="h-4 w-2/3 bg-[#EAE4DF] dark:bg-[#283832] rounded" />
        </div>

        {/* 3 Paragraphs Placeholder */}
        <div className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <div className="h-3.5 w-full bg-[#EAE4DF] dark:bg-[#283832] rounded" />
            <div className="h-3.5 w-11/12 bg-[#EAE4DF] dark:bg-[#283832] rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3.5 w-full bg-[#EAE4DF] dark:bg-[#283832] rounded" />
            <div className="h-3.5 w-4/5 bg-[#EAE4DF] dark:bg-[#283832] rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3.5 w-3/4 bg-[#EAE4DF] dark:bg-[#283832] rounded" />
          </div>
        </div>

        {/* Call to action Placeholder */}
        <div className="pt-2">
          <div className="h-8 w-1/2 bg-[#EAE4DF] dark:bg-[#283832] rounded-lg" />
        </div>
      </div>
    </div>
  );
};
