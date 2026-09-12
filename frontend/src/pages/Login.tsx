import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('cwa_user', JSON.stringify({ email: email || 'citizen@karachi.pk', name: 'Karachi Citizen' }));
    toast.success('Signed in successfully');
    navigate('/complaints');
  };

  const handleDemoLogin = () => {
    localStorage.setItem('cwa_user', JSON.stringify({ email: 'demo.citizen@karachi.gov.pk', name: 'M. Tariq (Karachi Resident)' }));
    toast.success('Signed in with Demo Citizen Profile');
    navigate('/complaints');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-[#006600] text-white flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-[#1F2937]">Citizen Login</h2>
        <p className="text-xs text-gray-500">
          Sign in to access your complete civic complaint records
        </p>
      </div>

      <div className="civic-card p-6 space-y-5 bg-white">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@karachi.pk"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#006600] focus:ring-1 focus:ring-[#006600] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#006600] focus:ring-1 focus:ring-[#006600] outline-none"
              />
            </div>
          </div>

          <button type="submit" className="civic-btn-primary w-full py-2.5 text-sm">
            Sign In <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium">Or</span></div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="civic-btn-secondary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-emerald-300 text-[#006600] bg-emerald-50/50 hover:bg-emerald-50"
        >
          <UserCheck className="w-4 h-4" />
          Quick Citizen Demo Access
        </button>
      </div>
    </div>
  );
};
