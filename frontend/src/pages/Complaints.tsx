import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, PlusCircle, ArrowUpDown, Filter, Loader2, Inbox } from 'lucide-react';
import { api } from '../services/api';
import { ComplaintDetail } from '../types';
import { ComplaintCard } from '../components/ComplaintCard';

export const Complaints: React.FC = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<ComplaintDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await api.getComplaints({
        date_filter: dateFilter,
        sort: sortOrder,
        search: searchQuery
      });
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [dateFilter, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComplaints();
  };

  const filterButtons = [
    { id: 'all', label: t('dashboard.filter_all') },
    { id: 'today', label: t('dashboard.filter_today') },
    { id: 'last_week', label: t('dashboard.filter_week') },
    { id: 'last_month', label: t('dashboard.filter_month') }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
            {t('dashboard.title')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <Link
          to="/report"
          className="civic-btn-primary py-2.5 px-4 text-xs sm:text-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          {t('dashboard.report_cta')}
        </Link>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="civic-card p-4 space-y-3 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Date Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {filterButtons.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setDateFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  dateFilter === f.id
                    ? 'bg-[#006600] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-gray-400 font-medium">Sort:</span>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="civic-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1"
            >
              <ArrowUpDown className="w-3 h-3" />
              {sortOrder === 'newest' ? t('dashboard.sort_newest') : t('dashboard.sort_oldest')}
            </button>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('dashboard.search_placeholder')}
            className="w-full pl-9 pr-20 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E7EB] focus:border-[#006600] focus:ring-1 focus:ring-[#006600] outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 rounded-md transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Complaints List or Empty States */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#006600] mx-auto" />
          <p className="text-xs text-gray-400">Loading civic complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="civic-card p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-gray-800">
              {t('dashboard.empty_title')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('dashboard.empty_desc')}
            </p>
          </div>
          <Link to="/report" className="civic-btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5" />
            {t('dashboard.report_cta')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complaints.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
};
