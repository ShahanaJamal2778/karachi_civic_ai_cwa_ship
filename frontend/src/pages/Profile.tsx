import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Globe, Shield, LogOut } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('cwa_user') || '{"name": "Karachi Citizen", "email": "citizen@karachi.pk"}');

  const handleLogout = () => {
    localStorage.removeItem('cwa_user');
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="civic-card p-6 space-y-6 bg-white">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
          <div className="w-14 h-14 rounded-full bg-[#E8F5E9] text-[#006600] flex items-center justify-center font-bold text-xl">
            {user.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-800">{user.name}</h3>
            <p className="text-xs text-gray-500 font-mono">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500 font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              Language Preference
            </span>
            <LanguageToggle />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500 font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              Account Status
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Verified Citizen
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="civic-btn-secondary w-full py-2.5 text-xs text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          {t('nav.logout')}
        </button>
      </div>
    </div>
  );
};
