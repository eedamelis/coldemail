import React, { useState, useEffect } from "react";
import { PitchRecord } from "../types";
import {
  X,
  Trash2,
  Calendar,
  Target,
  RotateCcw,
  Search,
  Clock,
  Briefcase,
  Building,
} from "lucide-react";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PitchRecord[];
  onSelectRecord: (record: PitchRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  records,
  onSelectRecord,
  onDeleteRecord,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const now = Date.now();
    const diffMins = Math.floor((now - timestamp) / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRecords = records.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const angleText = (r.result.hookThesis || r.result.angle_title || "").toLowerCase();
    const subjectText = (r.result.subjectLine || r.result.subject_line || "").toLowerCase();
    return (
      angleText.includes(q) ||
      subjectText.includes(q) ||
      r.companyText.toLowerCase().includes(q) ||
      r.offering.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div
        className="relative z-10 w-full sm:max-w-md bg-white dark:bg-[#1E2824] border-l border-[#E0D7D0] dark:border-[#2C3933] shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-250"
        id="recent-pitches-drawer"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#E0D7D0] dark:border-[#2C3933] flex items-center justify-between bg-[#FAF9F7] dark:bg-[#18221E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3E5C52]/10 dark:bg-[#3E5C52]/20 flex items-center justify-center text-[#3E5C52] dark:text-[#7BA597]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1B2B24] dark:text-[#EDEAE5]">
                  Recent Pitches
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E0D7D0]/60 dark:bg-[#2C3933] text-[#5C544E] dark:text-[#C5BEB7]">
                  {records.length}
                </span>
              </div>
              <p className="text-[11px] text-[#7A7169] dark:text-[#A8A199]">
                Auto-saved offline in IndexedDB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {records.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to clear all saved pitches from IndexedDB?",
                    )
                  ) {
                    onClearAll();
                  }
                }}
                id="clear-all-history-btn"
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer font-medium transition-colors"
                title="Clear all saved history"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              id="close-history-drawer-btn"
              className="p-1.5 rounded-xl text-[#7A7169] dark:text-[#A8A199] hover:text-[#1B2B24] dark:hover:text-[#EDEAE5] hover:bg-[#E0D7D0]/40 dark:hover:bg-[#2C3933] transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar if multiple records */}
        {records.length > 2 && (
          <div className="p-3 border-b border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7169] dark:text-[#A8A199]" />
              <input
                type="text"
                placeholder="Search recent pitches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-recent-pitches-input"
                className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-[#E0D7D0] dark:border-[#2C3933] bg-[#FAF9F7] dark:bg-[#18221E] text-[#1B2B24] dark:text-[#EDEAE5] placeholder-[#7A7169] focus:outline-hidden focus:border-[#3E5C52]"
              />
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {records.length === 0 ? (
            <div className="text-center py-16 px-4 text-[#7A7169] dark:text-[#A8A199] space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E0D7D0]/30 dark:bg-[#2C3933]/50 flex items-center justify-center text-[#7A7169]">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm text-[#1B2B24] dark:text-[#EDEAE5]">
                  No saved pitches yet
                </p>
                <p className="text-xs text-[#7A7169] dark:text-[#A8A199] max-w-xs mx-auto">
                  Every pitch you generate is automatically saved to IndexedDB so you can view and restore it anytime.
                </p>
              </div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-[#7A7169] text-xs">
              No pitches match &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                id={`history-item-${record.id}`}
                className="p-4 rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] bg-[#FAF9F7] dark:bg-[#18221E] hover:border-[#3E5C52]/60 hover:shadow-xs transition-all flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#3E5C52] dark:text-[#7BA597] bg-[#F0F7F4] dark:bg-[#23352E] px-2 py-0.5 rounded-md border border-[#3E5C52]/20">
                        <Target className="w-3 h-3" />
                        {record.result.hookThesis || record.result.angle_title}
                      </span>
                      <span className="text-[10px] text-[#7A7169] dark:text-[#A8A199] flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatDate(record.createdAt)}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-[#1B2B24] dark:text-[#EDEAE5] line-clamp-1 mt-1">
                      {record.result.subjectLine || record.result.subject_line}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecord(record.id);
                    }}
                    id={`delete-history-${record.id}`}
                    className="p-1.5 text-[#7A7169] dark:text-[#A8A199] hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-white dark:hover:bg-[#283832]"
                    title="Delete saved pitch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Context Snippet */}
                <div className="text-[11px] text-[#5C544E] dark:text-[#C5BEB7] space-y-1 bg-white dark:bg-[#202C27] p-2.5 rounded-xl border border-[#E0D7D0]/60 dark:border-[#2C3933]/60">
                  <div className="flex items-start gap-1.5 line-clamp-1">
                    <Building className="w-3 h-3 text-[#7A7169] shrink-0 mt-0.5" />
                    <span className="truncate">{record.companyText}</span>
                  </div>
                  <div className="flex items-start gap-1.5 line-clamp-1">
                    <Briefcase className="w-3 h-3 text-[#3E5C52] dark:text-[#7BA597] shrink-0 mt-0.5" />
                    <span className="truncate">{record.offering}</span>
                  </div>
                </div>

                {/* Actions: Restore */}
                <div className="flex items-center justify-between pt-1 border-t border-[#E0D7D0]/50 dark:border-[#2C3933]/50">
                  <span className="text-[10px] text-[#7A7169] dark:text-[#A8A199]">
                    3-paragraph ready draft
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRecord(record);
                      onClose();
                    }}
                    id={`restore-pitch-${record.id}`}
                    className="text-xs font-bold text-white bg-[#3E5C52] hover:bg-[#2F463E] flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-xl transition-all shadow-xs"
                    title="Restore inputs and pitch results"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Pitch</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
