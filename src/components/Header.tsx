import React from 'react';
import { Sparkles, Moon, Sun, History } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  savedCount: number;
  onOpenHistory: () => void;
  onLoadSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  savedCount,
  onOpenHistory,
  onLoadSample,
}) => {
  return (
    <header className="w-full border-b border-[#E0D7D0] dark:border-[#2C3933] bg-white/95 dark:bg-[#1E2824]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3E5C52] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#1B2B24] dark:text-[#EDEAE5] flex items-center gap-1.5 leading-none">
              PitchHook
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-[#7A7169] dark:text-[#A8A199]">
                Evidence-based cold outreach
              </p>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3E5C52] dark:bg-[#618D80]" title="Auto-saving to IndexedDB" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            id="load-sample-btn"
            className="text-xs font-semibold px-2.5 py-1.5 rounded-md border border-[#E0D7D0] dark:border-[#2C3933] bg-[#FAF9F7] dark:bg-[#18221E] text-[#2D2D2D] dark:text-[#EDEAE5] hover:bg-[#EAE4DF] dark:hover:bg-[#283832] transition-colors cursor-pointer"
            title="Load sample company and offering"
          >
            Sample
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            id="history-btn"
            className="relative p-2 rounded-lg text-[#7A7169] dark:text-[#A8A199] hover:bg-[#FAF9F7] dark:hover:bg-[#18221E] hover:text-[#1B2B24] dark:hover:text-[#EDEAE5] transition-colors cursor-pointer"
            aria-label="View saved pitches"
            title="Saved pitches in IndexedDB"
          >
            <History className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#3E5C52] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {savedCount > 9 ? '9+' : savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleDarkMode}
            id="theme-toggle-btn"
            className="p-2 rounded-lg text-[#7A7169] dark:text-[#A8A199] hover:bg-[#FAF9F7] dark:hover:bg-[#18221E] hover:text-[#1B2B24] dark:hover:text-[#EDEAE5] transition-colors cursor-pointer"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
