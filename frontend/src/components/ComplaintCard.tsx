import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, Calendar, ArrowRight, Users } from 'lucide-react';
import { ComplaintDetail } from '../types';
import { StatusBadge } from './StatusBadge';
import { format, parseISO } from 'date-fns';

interface ComplaintCardProps {
  complaint: ComplaintDetail;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  let formattedDate = 'Recently';
  try {
    formattedDate = format(parseISO(complaint.created_at), 'MMMM dd, yyyy • hh:mm a');
  } catch (e) {
    formattedDate = complaint.created_at;
  }

  const categoryLabel = complaint.category.replace('_', ' ').toUpperCase();

  return (
    <Link
      to={`/complaints/${complaint.id}`}
      className="civic-card p-5 block hover:border-[#006600]/40 transition-all group"
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#006600]" />
          <h4 className="font-bold text-[#1F2937] text-base group-hover:text-[#006600] transition-colors">
            {categoryLabel}
          </h4>
          {complaint.report_count > 1 && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold">
              <Users className="w-3 h-3" />
              {complaint.report_count} reports
            </span>
          )}
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <div className="text-xs text-gray-400 flex items-center gap-1.5 mb-3 font-medium">
        <Calendar className="w-3.5 h-3.5" />
        <span>{formattedDate}</span>
      </div>

      <div className="space-y-2 text-xs text-gray-600 mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#006600] flex-shrink-0" />
          <span className="truncate font-medium text-gray-800">
            {complaint.location.area || complaint.location.address}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <span>Authority: </span>
          <span className="font-semibold text-gray-800">
            {complaint.authority.short_name || complaint.authority.name}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
        <span className="font-mono text-gray-400 font-medium">
          Ref: {complaint.reference_id}
        </span>
        <span className="text-[#006600] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Details <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};
