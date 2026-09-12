import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  Send,
  Copy,
  Check,
  Building2,
  MapPin,
  AlertTriangle,
  Users,
  Info,
  Phone,
  Mail
} from 'lucide-react';
import { AnalyzeResponse } from '../types';
import { toast } from 'sonner';

interface ComplaintPreviewProps {
  data: AnalyzeResponse;
  onSend: () => void;
  onSupportDuplicate: () => void;
  onEdit: () => void;
  sending: boolean;
}

export const ComplaintPreview: React.FC<ComplaintPreviewProps> = ({
  data,
  onSend,
  onSupportDuplicate,
  onEdit,
  sending
}) => {
  const { t } = useTranslation();
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'ur'>('en');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const textToCopy =
      activeLangTab === 'en' ? data.complaint.english : data.complaint.urdu;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Complaint copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const hasEmail = data.authority.email_configured && Boolean(data.authority.email);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Duplicate Warning Banner if applicable */}
      {data.duplicate.is_duplicate && (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-3 shadow-sm">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm">
                {t('result.duplicate_title')}
              </h5>
              <p className="text-xs text-purple-700 mt-0.5">
                {data.duplicate.report_count} {t('result.duplicate_desc')}
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onSupportDuplicate}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-sm"
            >
              {t('result.add_my_report')}
            </button>
          </div>
        </div>
      )}

      {/* Main Analysis Card */}
      <div className="civic-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#006600] uppercase tracking-wider block mb-0.5">
              {t('result.issue_detected')}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] flex items-center gap-2">
              <span>{data.classification.category.replace('_', ' ').toUpperCase()}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 uppercase font-semibold">
                {data.classification.severity} Severity
              </span>
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-gray-400 block">
              {t('result.confidence')}
            </span>
            <span className="text-sm font-bold text-emerald-700">
              {Math.round(data.classification.confidence * 100)}%
            </span>
          </div>
        </div>

        {/* Location & Authority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-lg bg-[#F7F8F7] border border-[#E5E7EB] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#006600]" />
              <span>{t('result.location')}</span>
            </div>
            <p className="text-sm font-medium text-[#1F2937]">
              {data.location.area || data.location.address}
            </p>
            <span className="text-[11px] text-gray-400 block font-mono">
              Source: {data.location.location_source.toUpperCase()}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F7F8F7] border border-[#E5E7EB] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase">
              <Building2 className="w-3.5 h-3.5 text-[#006600]" />
              <span>{t('result.authority')}</span>
            </div>
            <p className="text-sm font-bold text-[#006600]">
              {data.authority.name} ({data.authority.short_name})
            </p>
            {hasEmail ? (
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <Mail className="w-3 h-3 text-emerald-600" />
                {data.authority.email}
              </span>
            ) : (
              <span className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                <Phone className="w-3 h-3 text-amber-600" />
                {data.authority.phone || 'Contact pending'} (Helpline)
              </span>
            )}
          </div>
        </div>

        {/* Authority routing reason */}
        {data.authority.routing_reason && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900">
            <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <span>{data.authority.routing_reason}</span>
          </div>
        )}

        {/* No Email warning banner for authorities like SSWMB */}
        {!hasEmail && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{t('result.no_email_warning')}</p>
              <p className="text-amber-700 mt-0.5">
                Your complaint will be saved with a reference ID for direct helpline follow-up: {data.authority.phone}.
              </p>
            </div>
          </div>
        )}

        {/* Bilingual Complaint Draft Preview */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeLangTab === 'en'
                    ? 'bg-[#006600] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('result.english_tab')}
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('ur')}
                className={`px-3 py-1 rounded-md text-xs font-semibold font-urdu transition-all ${
                  activeLangTab === 'ur'
                    ? 'bg-[#006600] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('result.urdu_tab')}
              </button>
            </div>

            <button
              type="button"
              onClick={copyToClipboard}
              className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {t('result.copy_button')}
            </button>
          </div>

          <div
            dir={activeLangTab === 'ur' ? 'rtl' : 'ltr'}
            className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto"
          >
            {activeLangTab === 'en' ? data.complaint.english : data.complaint.urdu}
          </div>
          <p className="text-[11px] text-gray-400 italic">
            * Note: The email dispatched to government authorities is always sent in formal English.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onEdit}
            className="civic-btn-secondary w-full sm:w-auto text-xs sm:text-sm"
          >
            {t('result.edit_button')}
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={sending}
            className="civic-btn-primary w-full sm:w-auto text-xs sm:text-sm flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending Complaint...' : t('result.send_button')}
          </button>
        </div>
      </div>
    </div>
  );
};
