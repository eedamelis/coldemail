import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface PitchErrorBannerProps {
  message: string;
  onRetry: () => void;
  onDismiss?: () => void;
  isLoading?: boolean;
}

export const PitchErrorBanner: React.FC<PitchErrorBannerProps> = ({
  message,
  onRetry,
  onDismiss,
  isLoading = false,
}) => {
  // Format friendly user-facing text if message contains developer jargon
  let friendlyMessage = message;
  if (
    message.includes('SyntaxError') ||
    message.includes('JSON') ||
    message.includes('unreadable')
  ) {
    friendlyMessage =
      'The AI service returned an unexpected format. Please try again with the same inputs.';
  } else if (
    message.includes('500') ||
    message.includes('502') ||
    message.includes('Failed to fetch') ||
    message.includes('NetworkError')
  ) {
    friendlyMessage =
      'Unable to connect to the Gemini API right now. Please check your connection and try again.';
  }

  return (
    <div
      id="pitch-error-banner"
      role="alert"
      className="rounded-2xl border border-[#F2C9C5] dark:border-[#5A3331] bg-[#FDF6F5] dark:bg-[#281A1A] p-5 sm:p-6 shadow-xs space-y-3 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#932F29]/10 dark:bg-[#932F29]/20 text-[#932F29] dark:text-[#F4A8A3] flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-[#932F29] dark:text-[#F4A8A3]">
              Unable to generate pitch
            </h3>
            <p className="text-xs sm:text-sm text-[#732924] dark:text-[#E89994] leading-relaxed">
              {friendlyMessage}
            </p>
            <p className="text-[11px] text-[#A6615C] dark:text-[#C57E7A]">
              Your input copy and selected angle have been safely kept.
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="text-[#932F29] dark:text-[#F4A8A3] hover:opacity-75 p-1 rounded-md transition-opacity cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="pt-1 flex items-center gap-3">
        <button
          type="button"
          id="retry-pitch-btn"
          onClick={onRetry}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#932F29] hover:bg-[#7D2621] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};
