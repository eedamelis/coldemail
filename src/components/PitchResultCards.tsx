import React, { useState } from 'react';
import { PitchResult } from '../types';
import {
  Copy,
  Check,
  Mail,
  Quote,
  Target,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface PitchResultCardsProps {
  result: PitchResult;
}

export const PitchResultCards: React.FC<PitchResultCardsProps> = ({ result }) => {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedCta, setCopiedCta] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyToClipboard = async (text: string, type: 'subject' | 'email' | 'cta' | 'all') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'subject') {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
      } else if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else if (type === 'cta') {
        setCopiedCta(true);
        setTimeout(() => setCopiedCta(false), 2000);
      } else if (type === 'all') {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      if (type === 'subject') setCopiedSubject(true);
      if (type === 'email') setCopiedEmail(true);
      if (type === 'cta') setCopiedCta(true);
      if (type === 'all') setCopiedAll(true);
      setTimeout(() => {
        setCopiedSubject(false);
        setCopiedEmail(false);
        setCopiedCta(false);
        setCopiedAll(false);
      }, 2000);
    }
  };

  const handleOpenEmailClient = () => {
    const mailto = `mailto:?subject=${encodeURIComponent(result.subject_line)}&body=${encodeURIComponent(
      result.email_body
    )}`;
    window.location.href = mailto;
  };

  const fullPitchText = `Subject: ${result.subject_line}

${result.email_body}

[Hook: ${result.angle_title}]
[Evidence: "${result.evidence_snippet}"]
[CTA: ${result.call_to_action}]`;

  return (
    <div className="space-y-4 pt-2" id="pitch-results-container">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#7A7169] dark:text-[#A8A199] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3E5C52] inline-block"></span>
          Generated Pitch Analysis
        </h2>
        <button
          type="button"
          onClick={() => copyToClipboard(fullPitchText, 'all')}
          id="copy-full-pitch-btn"
          className="text-xs font-semibold text-[#3E5C52] dark:text-[#7BA597] hover:text-[#2F463E] dark:hover:text-[#A1C5B9] flex items-center gap-1 cursor-pointer transition-colors py-1 px-2.5 rounded-lg hover:bg-[#F0F7F4] dark:hover:bg-[#23352E]"
        >
          {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedAll ? 'Copied Full Pitch' : 'Copy Full Summary'}</span>
        </button>
      </div>

      {/* Card 1: Core Value Hook, Evidence Snippet, and Rationale */}
      <div
        id="card-hook-evidence"
        className="rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824] p-4 sm:p-5 shadow-xs space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#F0F7F4] dark:bg-[#23352E] text-[#3E5C52] dark:text-[#7BA597] border border-[#3E5C52]/20">
              <Target className="w-3 h-3" />
              Angle: {result.angle_title}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#1B2B24] dark:text-[#EDEAE5] mt-2 leading-snug">
              {result.angle_title}
            </h3>
          </div>
        </div>

        {/* Evidence Snippet and Rationale in Two-Tone Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#FAF9F7] dark:bg-[#18221E] rounded-xl border border-[#E0D7D0] dark:border-[#2C3933]">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#7A7169] dark:text-[#A8A199] mb-1">
              <Quote className="w-3 h-3 text-[#3E5C52] dark:text-[#7BA597]" />
              Evidence Snippet
            </div>
            <p className="text-xs leading-relaxed italic text-[#5C544E] dark:text-[#C5BEB7]">
              &ldquo;{result.evidence_snippet}&rdquo;
            </p>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#7A7169] dark:text-[#A8A199] mb-1">
              Mutual Value Rationale
            </div>
            <p className="text-xs leading-relaxed text-[#5C544E] dark:text-[#C5BEB7]">
              {result.rationale}
            </p>
          </div>
        </div>
      </div>

      {/* Card 2: Outreach Subject Line with 1-Click Copy */}
      <div
        id="card-subject-line"
        className="rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824] p-4 sm:p-5 shadow-xs"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A7169] dark:text-[#A8A199]">
            Subject Line
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard(result.subject_line, 'subject')}
            id="copy-subject-btn"
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#E0D7D0] dark:border-[#2C3933] text-[#7A7169] dark:text-[#A8A199] hover:text-[#1B2B24] dark:hover:text-[#EDEAE5] hover:bg-[#FAF9F7] dark:hover:bg-[#18221E] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy subject line"
          >
            {copiedSubject ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3E5C52] dark:text-[#7BA597]" />
                <span className="text-[#3E5C52] dark:text-[#7BA597]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <p className="text-base sm:text-lg font-semibold text-[#1B2B24] dark:text-[#EDEAE5] select-all">
          {result.subject_line}
        </p>
      </div>

      {/* Card 3: Ready-to-Send 3-Paragraph Pitch Email Draft */}
      <div
        id="card-email-body"
        className="rounded-2xl border border-[#E0D7D0] dark:border-[#2C3933] bg-white dark:bg-[#1E2824] p-4 sm:p-5 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE6] dark:border-[#2C3933]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#3E5C52] dark:text-[#7BA597]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A7169] dark:text-[#A8A199]">
              Pitch Email Draft (3 Paragraphs)
            </span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(result.email_body, 'email')}
            id="copy-email-btn"
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#3E5C52] hover:bg-[#2F463E] text-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Copy email body"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Draft!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Draft</span>
              </>
            )}
          </button>
        </div>

        {/* Clean render of the email text preserving whitespace/paragraphs */}
        <div className="text-xs sm:text-sm text-[#1B2B24] dark:text-[#EDEAE5] leading-relaxed bg-[#FAF9F7] dark:bg-[#18221E] p-4 border border-[#F0EBE6] dark:border-[#2C3933] rounded-xl whitespace-pre-line select-all space-y-3 font-normal">
          {result.email_body}
        </div>
      </div>

      {/* Card 4: Low-Friction Call to Action (CTA) */}
      <div
        id="card-call-to-action"
        className="rounded-2xl border border-[#3E5C52]/20 bg-[#3E5C52]/5 dark:bg-[#3E5C52]/15 p-4 sm:p-5 shadow-xs"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3E5C52] dark:text-[#7BA597] flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5" />
            Next Step: Low-Friction CTA
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard(result.call_to_action, 'cta')}
            id="copy-cta-btn"
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#3E5C52]/30 text-[#3E5C52] dark:text-[#7BA597] hover:bg-[#3E5C52]/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy CTA"
          >
            {copiedCta ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <p className="text-sm sm:text-base font-semibold text-[#1B2B24] dark:text-[#EDEAE5] select-all">
          {result.call_to_action}
        </p>
      </div>

      {/* Mobile-Friendly Quick Mailto Action */}
      <div className="pt-1 pb-4 flex justify-center">
        <button
          type="button"
          onClick={handleOpenEmailClient}
          id="open-mail-app-btn"
          className="text-xs text-[#7A7169] dark:text-[#A8A199] hover:text-[#3E5C52] dark:hover:text-[#7BA597] flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-[#E0D7D0] dark:border-[#2C3933] bg-white/70 dark:bg-[#1E2824]/70 hover:bg-white dark:hover:bg-[#1E2824] transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open draft in default mail app</span>
        </button>
      </div>
    </div>
  );
};
