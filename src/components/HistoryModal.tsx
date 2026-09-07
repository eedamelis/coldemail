import React from 'react';
import { PitchRecord } from '../types';
import { X, Trash2, Calendar, Target, ArrowUpRight } from 'lucide-react';

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
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="w-full sm:max-w-xl bg-white dark:bg-[#1E2824] rounded-t-3xl sm:rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] shadow-xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        id="history-modal"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E0D7D0] dark:border-[#2C3933] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1B2B24] dark:text-[#EDEAE5]">
              Saved Pitch History
            </h2>
            <p className="text-xs text-[#7A7169] dark:text-[#A8A199]">
              Persisted offline in local IndexedDB
            </p>
          </div>
          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                id="clear-all-history-btn"
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 px-2.5 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer font-medium"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              id="close-history-btn"
              className="p-1.5 rounded-lg text-[#7A7169] dark:text-[#A8A199] hover:bg-[#FAF9F7] dark:hover:bg-[#18221E] cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {records.length === 0 ? (
            <div className="text-center py-12 text-[#7A7169] dark:text-[#A8A199] text-xs sm:text-sm">
              <p className="font-semibold text-[#1B2B24] dark:text-[#EDEAE5]">No saved pitches yet.</p>
              <p className="mt-1 text-[#7A7169] dark:text-[#A8A199]">
                Pitches you generate are automatically stored in IndexedDB.
              </p>
            </div>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                id={`history-item-${record.id}`}
                className="p-3.5 rounded-xl border border-[#E0D7D0] dark:border-[#2C3933] bg-[#FAF9F7] dark:bg-[#18221E] hover:border-[#3E5C52]/50 transition-colors flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3E5C52] dark:text-[#7BA597] bg-[#F0F7F4] dark:bg-[#23352E] px-2 py-0.5 rounded-md border border-[#3E5C52]/20">
                        <Target className="w-3 h-3" />
                        {record.result.angle_title}
                      </span>
                      <span className="text-[11px] text-[#7A7169] dark:text-[#A8A199] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(record.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#1B2B24] dark:text-[#EDEAE5] mt-1.5 line-clamp-1">
                      {record.result.subject_line}
                    </p>
                    <p className="text-[11px] text-[#7A7169] dark:text-[#A8A199] mt-0.5 line-clamp-2">
                      {record.offering}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecord(record.id);
                    }}
                    id={`delete-history-${record.id}`}
                    className="p-1.5 text-[#7A7169] dark:text-[#A8A199] hover:text-red-500 transition-colors cursor-pointer rounded-md hover:bg-white dark:hover:bg-[#283832]"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex justify-end pt-1 border-t border-[#E0D7D0]/60 dark:border-[#2C3933]/60">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRecord(record);
                      onClose();
                    }}
                    id={`load-history-${record.id}`}
                    className="text-xs font-bold text-[#3E5C52] dark:text-[#7BA597] hover:text-[#2F463E] dark:hover:text-[#A1C5B9] flex items-center gap-1 cursor-pointer py-1 px-2 rounded-md hover:bg-[#F0F7F4] dark:hover:bg-[#23352E]"
                  >
                    <span>Load this pitch</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
