import React, { useState, useEffect, useRef, useTransition } from "react";
import { FileText, Sparkles, Clock, RotateCcw, History } from "lucide-react";
import { Header } from "./components/Header";
import { PitchForm } from "./components/PitchForm";
import { PitchResultCards } from "./components/PitchResultCards";
import { PitchLoadingSkeleton } from "./components/PitchLoadingSkeleton";
import { PitchErrorBanner } from "./components/PitchErrorBanner";
import { HistoryModal } from "./components/HistoryModal";
import { PitchResult, PitchRecord, DraftState } from "./types";
import { SAMPLE_DATA } from "./data/samples";
import {
  saveDraftState,
  loadDraftState,
  savePitchRecord,
  loadAllPitchRecords,
  deletePitchRecord,
  clearAllPitchRecords,
} from "./lib/db";

export default function App() {
  const [companyText, setCompanyText] = useState("");
  const [offering, setOffering] = useState("");
  const [selectedAngle, setSelectedAngle] = useState("pain_point");
  const [customAngleText, setCustomAngleText] = useState("");
  const [currentResult, setCurrentResult] = useState<PitchResult | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [historyRecords, setHistoryRecords] = useState<PitchRecord[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("pitchhook_theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const isInitialLoadDone = useRef(false);
  const [, startTransition] = useTransition();

  // Apply dark mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("pitchhook_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("pitchhook_theme", "light");
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
          setCompanyText(draft.companyText || "");
          setOffering(draft.offering || "");
          setSelectedAngle(draft.selectedAngle || "pain_point");
          setCustomAngleText(draft.customAngleText || "");
          setCurrentResult(draft.currentResult || null);
          setCurrentRecordId(draft.currentRecordId || null);
        }

        if (history) {
          setHistoryRecords(history);
        }
      } catch (err) {
        console.error("Failed to restore from IndexedDB:", err);
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
        console.error("Failed to auto-save draft to IndexedDB:", e),
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [
    companyText,
    offering,
    selectedAngle,
    customAngleText,
    currentResult,
    currentRecordId,
  ]);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleLoadSample = () => {
    setCompanyText(SAMPLE_DATA.companyText);
    setOffering(SAMPLE_DATA.offering);
    setSelectedAngle(SAMPLE_DATA.angle);
    setErrorMessage(null);
  };

  const handleTryExample = () => {
    setCompanyText(SAMPLE_DATA.companyText);
    setOffering(SAMPLE_DATA.offering);
    setSelectedAngle(SAMPLE_DATA.angle);
    setErrorMessage(null);
    const el = document.getElementById("company-text");
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleResetForm = () => {
    setCompanyText("");
    setOffering("");
    setSelectedAngle("pain_point");
    setCustomAngleText("");
    setCurrentResult(null);
    setCurrentRecordId(null);
    setErrorMessage(null);
  };

  const executeGeneration = async () => {
    if (!companyText.trim() || !offering.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyText,
          offering,
          angle: selectedAngle,
          customAngleText:
            selectedAngle === "custom" ? customAngleText : undefined,
        }),
      });

      let responseText = "";
      try {
        responseText = await response.text();
      } catch (e) {
        throw new Error("Unable to read response from server.");
      }

      if (!response.ok) {
        let errMsg = "Failed to generate pitch. Please try again.";
        try {
          const errObj = JSON.parse(responseText);
          if (errObj.error) errMsg = errObj.error;
        } catch {
          errMsg = `Server responded with status ${response.status}`;
        }
        throw new Error(errMsg);
      }

      let generated: PitchResult;
      try {
        generated = JSON.parse(responseText);
      } catch {
        throw new Error(
          "The AI service returned an unreadable response format. Please try again.",
        );
      }

      // Validate required fields
      const requiredFields: (keyof PitchResult)[] = [
        "angle_title",
        "evidence_snippet",
        "rationale",
        "subject_line",
        "email_body",
        "call_to_action",
      ];
      for (const field of requiredFields) {
        if (
          !generated[field] ||
          typeof generated[field] !== "string" ||
          !generated[field].trim()
        ) {
          throw new Error(
            "The generated pitch response was incomplete. Please try again.",
          );
        }
      }

      const recordId = "pitch_" + Date.now();

      const newRecord: PitchRecord = {
        id: recordId,
        createdAt: Date.now(),
        companyText,
        offering,
        angle: selectedAngle,
        customAngleText:
          selectedAngle === "custom" ? customAngleText : undefined,
        result: generated,
      };

      setCurrentResult(generated);
      setCurrentRecordId(recordId);

      // Save to IndexedDB history
      await savePitchRecord(newRecord);
      setHistoryRecords((prev) => [
        newRecord,
        ...prev.filter((r) => r.id !== recordId),
      ]);

      // Smooth scroll down to results container
      setTimeout(() => {
        const el = document.getElementById("pitch-results-container");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err: unknown) {
      console.error("Generation failed:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to generate pitch. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeGeneration();
  };

  const handleRetry = () => {
    executeGeneration();
  };

  const handleSelectHistoryRecord = (record: PitchRecord) => {
    startTransition(() => {
      setCompanyText(record.companyText);
      setOffering(record.offering);
      setSelectedAngle(record.angle);
      setCustomAngleText(record.customAngleText || "");
      setCurrentResult(record.result);
      setCurrentRecordId(record.id);
      setErrorMessage(null);
    });

    setTimeout(() => {
      const el = document.getElementById("pitch-results-container");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
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
    if (window.confirm("Delete all saved pitch history from local storage?")) {
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
            Paste raw company copy, define your capability, and receive an
            authentic evidence-hooked pitch.
          </p>
        </div>

        {/* Quick Access to Recent Pitches Drawer if available */}
        {historyRecords.length > 0 && (
          <div
            id="recent-pitches-bar"
            className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1E2824] border border-[#E0D7D0] dark:border-[#2C3933] shadow-xs transition-all"
          >
            <div className="flex items-center gap-2.5 text-xs text-[#1B2B24] dark:text-[#EDEAE5] truncate">
              <span className="w-6 h-6 rounded-lg bg-[#3E5C52]/10 dark:bg-[#3E5C52]/20 flex items-center justify-center text-[#3E5C52] dark:text-[#7BA597] shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </span>
              <span className="truncate">
                <strong className="font-semibold">{historyRecords.length} saved pitch{historyRecords.length === 1 ? "" : "es"}</strong> in IndexedDB
                <span className="hidden sm:inline text-[#7A7169] dark:text-[#A8A199] ml-1.5 font-normal">
                  • Latest: &ldquo;{historyRecords[0].result.angle_title}&rdquo;
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              id="view-recent-pitches-btn"
              className="text-xs font-bold text-[#3E5C52] dark:text-[#7BA597] hover:text-[#2F463E] dark:hover:text-[#A1C5B9] hover:bg-[#F0F7F4] dark:hover:bg-[#23352E] px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>View Drawer</span>
            </button>
          </div>
        )}

        {/* Form Section: stacked full-width input cards */}
        <section id="pitch-form-section" aria-label="Pitch inputs">
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
        </section>

        {/* Dynamic Results Area: Loading Skeleton, Error Banner, Generated Results, or Empty State */}
        {isLoading ? (
          <PitchLoadingSkeleton />
        ) : errorMessage ? (
          <div className="space-y-5">
            <PitchErrorBanner
              message={errorMessage}
              onRetry={handleRetry}
              onDismiss={() => setErrorMessage(null)}
              isLoading={isLoading}
            />
            {currentResult && <PitchResultCards result={currentResult} />}
          </div>
        ) : currentResult ? (
          <PitchResultCards result={currentResult} />
        ) : (
          <div
            id="empty-state"
            className="rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824] p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-xs transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#3E5C52]/10 dark:bg-[#3E5C52]/20 flex items-center justify-center text-[#3E5C52] dark:text-[#7BA597]">
              <FileText className="w-6 h-6" />
            </div>

            <div className="max-w-md space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-[#1B2B24] dark:text-[#EDEAE5]">
                No pitch generated yet
              </h3>
              <p className="text-xs sm:text-sm text-[#7A7169] dark:text-[#A8A199] leading-relaxed">
                Paste target company text (e.g. an About Us page, mission, or announcement) into the box above, enter your offering, and select an outreach angle to generate an authentic evidence-backed email draft.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                id="try-example-btn"
                onClick={handleTryExample}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#3E5C52] hover:bg-[#2F463E] transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Try an example</span>
              </button>

              {historyRecords.length > 0 && (
                <button
                  type="button"
                  id="empty-state-history-btn"
                  onClick={() => setIsHistoryOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1B2B24] dark:text-[#EDEAE5] bg-[#FAF9F7] dark:bg-[#18221E] border border-[#E0D7D0] dark:border-[#2C3933] hover:bg-[#EAE4DF] dark:hover:bg-[#283832] transition-all shadow-xs cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-[#3E5C52] dark:text-[#7BA597]" />
                  <span>Restore saved pitch ({historyRecords.length})</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full border-t border-[#E0D7D0]/80 dark:border-[#2C3933]/80 py-4 text-center text-xs text-[#7A7169] dark:text-[#A8A199]">
        <p>
          PitchHook • Client-persisted in IndexedDB • Natural Tones aesthetic
        </p>
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
