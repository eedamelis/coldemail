import React, { useState, useEffect, useRef, useTransition } from 'react';
import { Header } from './components/Header';
import { PitchForm } from './components/PitchForm';
import { PitchResultCards } from './components/PitchResultCards';
import { HistoryModal } from './components/HistoryModal';
import { PitchResult, PitchRecord, DraftState } from './types';
import { SAMPLE_DATA } from './data/samples';
import {
  saveDraftState,
  loadDraftState,
  savePitchRecord,
  loadAllPitchRecords,
  deletePitchRecord,
  clearAllPitchRecords,
} from './lib/db';

export default function App() {
  const [companyText, setCompanyText] = useState('');
  const [offering, setOffering] = useState('');
  const [selectedAngle, setSelectedAngle] = useState('pain_point');
  const [customAngleText, setCustomAngleText] = useState('');
  const [currentResult, setCurrentResult] = useState<PitchResult | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [historyRecords, setHistoryRecords] = useState<PitchRecord[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('pitchhook_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const isInitialLoadDone = useRef(false);
  const [, startTransition] = useTransition();

  // Apply dark mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pitchhook_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pitchhook_theme', 'light');
    }
  }, [darkMode]);

  // Load state from IndexedDB on initial mount
  useEffect(() => {
    async function initFromStorage() {
      try {
        const [draft, history] = await Promise.all([
          loadDraftState(),
          loadAllPitchRecords(),
        ]);

        if (draft) {
          setCompanyText(draft.companyText || '');
          setOffering(draft.offering || '');
          setSelectedAngle(draft.selectedAngle || 'pain_point');
          setCustomAngleText(draft.customAngleText || '');
          setCurrentResult(draft.currentResult || null);
          setCurrentRecordId(draft.currentRecordId || null);
        }

        if (history) {
          setHistoryRecords(history);
        }
      } catch (err) {
        console.error('Failed to restore from IndexedDB:', err);
      } finally {
        isInitialLoadDone.current = true;
      }
    }

    initFromStorage();
  }, []);

  // Debounced auto-save to IndexedDB when draft changes
  useEffect(() => {
    if (!isInitialLoadDone.current) return;

    const timer = setTimeout(() => {
      const draft: DraftState = {
        companyText,
        offering,
        selectedAngle,
        customAngleText,
        currentResult,
        currentRecordId,
      };
      saveDraftState(draft).catch((e) =>
        console.error('Failed to auto-save draft to IndexedDB:', e)
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [companyText, offering, selectedAngle, customAngleText, currentResult, currentRecordId]);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleLoadSample = () => {
    setCompanyText(SAMPLE_DATA.companyText);
    setOffering(SAMPLE_DATA.offering);
    setSelectedAngle(SAMPLE_DATA.angle);
    setErrorMessage(null);
  };

  const handleResetForm = () => {
    setCompanyText('');
    setOffering('');
    setSelectedAngle('pain_point');
    setCustomAngleText('');
    setCurrentResult(null);
    setCurrentRecordId(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyText.trim() || !offering.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyText,
          offering,
          angle: selectedAngle,
          customAngleText: selectedAngle === 'custom' ? customAngleText : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const generated: PitchResult = await response.json();
      const recordId = 'pitch_' + Date.now();

      const newRecord: PitchRecord = {
        id: recordId,
        createdAt: Date.now(),
        companyText,
        offering,
        angle: selectedAngle,
        customAngleText: selectedAngle === 'custom' ? customAngleText : undefined,
        result: generated,
      };

      setCurrentResult(generated);
      setCurrentRecordId(recordId);

      // Save to IndexedDB history
      await savePitchRecord(newRecord);
      setHistoryRecords((prev) => [newRecord, ...prev.filter((r) => r.id !== recordId)]);

      // Smooth scroll down to results container
      setTimeout(() => {
        const el = document.getElementById('pitch-results-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: unknown) {
      console.error('Generation failed:', err);
      const msg = err instanceof Error ? err.message : 'Failed to generate pitch. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryRecord = (record: PitchRecord) => {
    startTransition(() => {
      setCompanyText(record.companyText);
      setOffering(record.offering);
      setSelectedAngle(record.angle);
      setCustomAngleText(record.customAngleText || '');
      setCurrentResult(record.result);
      setCurrentRecordId(record.id);
      setErrorMessage(null);
    });

    setTimeout(() => {
      const el = document.getElementById('pitch-results-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleDeleteHistoryRecord = async (id: string) => {
    await deletePitchRecord(id);
    setHistoryRecords((prev) => prev.filter((r) => r.id !== id));
    if (currentRecordId === id) {
      setCurrentRecordId(null);
    }
  };

  const handleClearAllHistory = async () => {
    if (window.confirm('Delete all saved pitch history from local storage?')) {
      await clearAllPitchRecords();
      setHistoryRecords([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EE] dark:bg-[#131A17] text-[#1B2B24] dark:text-[#EDEAE5] flex flex-col font-sans transition-colors duration-150 selection:bg-[#3E5C52]/20 selection:text-[#1B2B24] dark:selection:text-[#EDEAE5]">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        savedCount={historyRecords.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onLoadSample={handleLoadSample}
      />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Intro Subtitle / Framing */}
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1B2B24] dark:text-[#EDEAE5]">
            Generate High-Conversion Outreach
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7169] dark:text-[#A8A199]">
            Paste raw company copy, define your capability, and receive an authentic evidence-hooked pitch.
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824] p-4 sm:p-6 shadow-xs">
          <PitchForm
            companyText={companyText}
            onCompanyTextChange={setCompanyText}
            offering={offering}
            onOfferingChange={setOffering}
            selectedAngle={selectedAngle}
            onSelectAngle={setSelectedAngle}
            customAngleText={customAngleText}
            onCustomAngleTextChange={setCustomAngleText}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onReset={handleResetForm}
            errorMessage={errorMessage}
          />
        </div>

        {/* Results Container */}
        {currentResult && <PitchResultCards result={currentResult} />}
      </main>

      {/* Footer Info */}
      <footer className="w-full border-t border-[#E0D7D0]/80 dark:border-[#2C3933]/80 py-4 text-center text-xs text-[#7A7169] dark:text-[#A8A199]">
        <p>PitchHook • Client-persisted in IndexedDB • Natural Tones aesthetic</p>
      </footer>

      {/* History Drawer Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={historyRecords}
        onSelectRecord={handleSelectHistoryRecord}
        onDeleteRecord={handleDeleteHistoryRecord}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
