import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, PlusCircle, ListFilter, Menu, X } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#006600] flex items-center justify-center text-white shadow-sm group-hover:bg-[#01411C] transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg text-[#1F2937] tracking-tight block leading-tight">
              {t('brand.name')}
            </span>
            <span className="text-[11px] text-[#006600] font-medium block leading-none">
              Karachi Civic AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/')
                ? 'bg-[#E8F5E9] text-[#006600]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/report"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              isActive('/report')
                ? 'bg-[#006600] text-white shadow-sm'
                : 'text-[#006600] hover:bg-[#E8F5E9]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            {t('nav.report')}
          </Link>
          <Link
            to="/complaints"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              isActive('/complaints')
                ? 'bg-[#E8F5E9] text-[#006600]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            {t('nav.complaints')}
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <LanguageToggle />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/') ? 'bg-[#E8F5E9] text-[#006600]' : 'text-gray-700'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/report') ? 'bg-[#006600] text-white' : 'text-[#006600]'
            }`}
          >
            {t('nav.report')}
          </Link>
          <Link
            to="/complaints"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/complaints') ? 'bg-[#E8F5E9] text-[#006600]' : 'text-gray-700'
            }`}
          >
            {t('nav.complaints')}
          </Link>
        </div>
      )}
    </header>
  );
};
