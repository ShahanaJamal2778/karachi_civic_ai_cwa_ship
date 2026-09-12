import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  Mic,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Sparkles,
  MapPin,
  Send
} from 'lucide-react';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  const authoritiesList = [
    { name: 'KWSB / KWSC', desc: 'Water supply & sewerage blockages', icon: '🚰' },
    { name: 'SSWMB', desc: 'Garbage & municipal solid waste', icon: '🚛' },
    { name: 'KMC', desc: 'Main roads, bridges, storm drains, major parks', icon: '🏛️' },
    { name: 'Cantonment Boards', desc: 'Clifton (CBC), Korangi, Faisal, Malir, Manora', icon: '🎖️' },
    { name: 'Town Administration', desc: 'Neighborhood streets, potholes & streetlights', icon: '🏘️' }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="pt-10 sm:pt-16 text-center max-w-3xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#006600] text-xs font-semibold border border-[#006600]/20 shadow-sm animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#006600]" />
          <span>Karachi Municipal AI Dispatch System</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F2937] tracking-tight leading-tight">
          {t('brand.name')}
        </h1>

        <p className="text-lg sm:text-xl font-medium text-[#006600]">
          "{t('brand.tagline')}"
        </p>

        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t('brand.subtext')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/report" className="civic-btn-primary w-full sm:w-auto text-base py-3 px-7">
            {t('nav.report')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link to="/complaints" className="civic-btn-secondary w-full sm:w-auto text-base py-3 px-6">
            {t('nav.complaints')}
          </Link>
        </div>

        <p className="text-xs text-gray-500 font-medium">
          ℹ️ {t('brand.hint')}
        </p>
      </section>

      {/* 3 Input Mode Cards */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Photo Card */}
          <Link
            to="/report?mode=photo"
            className="civic-card p-6 text-center space-y-4 hover:border-[#006600] group"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8F5E9] text-[#006600] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-[#1F2937] group-hover:text-[#006600] transition-colors">
                {t('modes.photo')}
              </h3>
              <p className="text-xs text-gray-500">
                {t('modes.photo_desc')}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#006600] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Snap evidence <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Voice Card */}
          <Link
            to="/report?mode=voice"
            className="civic-card p-6 text-center space-y-4 hover:border-[#006600] group"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8F5E9] text-[#006600] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-[#1F2937] group-hover:text-[#006600] transition-colors">
                {t('modes.voice')}
              </h3>
              <p className="text-xs text-gray-500">
                {t('modes.voice_desc')}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#006600] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Record voice note <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Text Card */}
          <Link
            to="/report?mode=text"
            className="civic-card p-6 text-center space-y-4 hover:border-[#006600] group"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8F5E9] text-[#006600] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-[#1F2937] group-hover:text-[#006600] transition-colors">
                {t('modes.text')}
              </h3>
              <p className="text-xs text-gray-500">
                {t('modes.text_desc')}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#006600] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Write complaint <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* The Core Value Proposition Flow */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="civic-card p-6 sm:p-8 bg-gradient-to-b from-white to-gray-50 space-y-6">
          <div className="text-center space-y-1 max-w-md mx-auto">
            <h3 className="font-bold text-lg sm:text-xl text-[#1F2937]">
              How It Works
            </h3>
            <p className="text-xs text-gray-500">
              From raw citizen input to automated government authority dispatch
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1 shadow-sm">
              <span className="text-lg">📷 🎙️ ✍️</span>
              <h5 className="font-bold text-xs text-[#1F2937]">1. INPUT</h5>
              <p className="text-[11px] text-gray-500">Photo, voice, or text in Roman Urdu</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1 shadow-sm">
              <span className="text-lg">🧠 📍</span>
              <h5 className="font-bold text-xs text-[#1F2937]">2. UNDERSTAND & LOCATE</h5>
              <p className="text-[11px] text-gray-500">EXIF, GPS, or extracted Karachi zone</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1 shadow-sm">
              <span className="text-lg">🏛️ 🔎</span>
              <h5 className="font-bold text-xs text-[#1F2937]">3. ROUTE & DEDUPLICATE</h5>
              <p className="text-[11px] text-gray-500">KWSB, SSWMB, KMC, or Cantonment</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1 shadow-sm">
              <span className="text-lg">📧 📊</span>
              <h5 className="font-bold text-xs text-[#1F2937]">4. GENERATE & SEND</h5>
              <p className="text-[11px] text-gray-500">Official English email sent automatically</p>
            </div>
          </div>
        </div>
      </section>

      {/* Authorities Covered */}
      <section className="max-w-5xl mx-auto px-4 space-y-4">
        <div className="text-center space-y-1">
          <h3 className="font-bold text-lg text-[#1F2937]">
            Configured Municipal Authorities
          </h3>
          <p className="text-xs text-gray-500">
            Complaints are routed strictly to verified database contacts
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {authoritiesList.map((a, i) => (
            <div key={i} className="civic-card p-4 flex items-start gap-3 bg-white">
              <span className="text-2xl">{a.icon}</span>
              <div>
                <h4 className="font-bold text-xs text-[#1F2937]">{a.name}</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
