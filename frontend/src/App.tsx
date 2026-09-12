import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Report } from './pages/Report';
import { Complaints } from './pages/Complaints';
import { ComplaintDetails } from './pages/ComplaintDetails';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { useTranslation } from 'react-i18next';

export const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F7] text-[#1F2937]">
      <Toaster position="top-center" richColors />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-[#E5E7EB] py-6 text-center text-xs text-gray-500">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-gray-700">
            {t('brand.name')} — "Report a problem. We'll find who can fix it."
          </p>
          <p className="text-[11px] text-gray-400">
            Empowering citizens across Karachi with AI-driven civic routing & government dispatch.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
