
import React from 'react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  profile: UserProfile;
  onBack: () => void;
  onUpdate: (profile: UserProfile) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  profile, 
  onBack, 
  onUpdate,
  darkMode,
  toggleDarkMode,
  language,
  onLanguageChange
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-[#049454] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to Feed
          </button>
          <h1 className="text-2xl font-extrabold dark:text-white tracking-tight">Profile & Settings</h1>
        </div>

        <div className="space-y-8">
          {/* Personal Info */}
          <section className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 bg-[#049454] rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-900/10">
                {profile.name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold dark:text-white">{profile.name}</h2>
                <p className="text-slate-400 font-medium">Member since {profile.joinDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => onUpdate({ ...profile, name: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => onUpdate({ ...profile, email: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={profile.phone} 
                  onChange={(e) => onUpdate({ ...profile, phone: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Default Delivery Address</label>
                <input 
                  type="text" 
                  value={profile.address} 
                  onChange={(e) => onUpdate({ ...profile, address: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 transition-all" 
                />
              </div>
            </div>
          </section>

          {/* App Settings */}
          <section className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold dark:text-white mb-8">App Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                  </div>
                  <div>
                    <p className="font-bold dark:text-white text-sm">Dark Mode</p>
                    <p className="text-xs text-slate-400">Reduce eye strain at night.</p>
                  </div>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`w-14 h-8 rounded-full relative transition-all ${darkMode ? 'bg-[#049454]' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${darkMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5a18.062 18.062 0 01-1.427-4.524m12.162 5.381a15.53 15.53 0 01-4.994 3.178"/></svg>
                  </div>
                  <div>
                    <p className="font-bold dark:text-white text-sm">Language</p>
                    <p className="text-xs text-slate-400">App display language.</p>
                  </div>
                </div>
                <select 
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none dark:text-white"
                >
                  <option>English</option>
                  <option>Hindi (हिन्दी)</option>
                  <option>Bengali</option>
                  <option>Tamil</option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-4">
            <button className="px-8 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">Reset Changes</button>
            <button onClick={onBack} className="bg-[#049454] text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-900/10 hover:bg-[#037c46] transition-all">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
