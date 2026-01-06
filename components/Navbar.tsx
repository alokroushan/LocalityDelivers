import React, { useState } from 'react';
import { AppSettings } from '../types';

interface NavbarProps {
  onCartClick: () => void;
  cartCount: number;
  onSearch: (query: string) => void;
  isSearching?: boolean;
  onSignInClick: () => void;
  user: { name: string; email: string; isSeller?: boolean; isAdmin?: boolean } | null;
  onSignOut: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  onOpenModal: (type: 'orders' | 'profile' | 'help' | 'seller-dashboard' | 'admin-dashboard') => void;
  appSettings: AppSettings;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onCartClick, 
  cartCount, 
  onSearch, 
  isSearching, 
  onSignInClick, 
  user,
  onSignOut,
  darkMode,
  toggleDarkMode,
  language,
  setLanguage,
  onOpenModal,
  appSettings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) onSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const setLightTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (darkMode) toggleDarkMode();
  };

  const setDarkTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!darkMode) toggleDarkMode();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[120] bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 px-4 md:px-8 h-20 flex items-center transition-colors duration-300">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-12 h-12 bg-[#049454] rounded-xl flex items-center justify-center text-white overflow-hidden shadow-sm">
            {appSettings.navIconUrl ? (
              <img src={appSettings.navIconUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
            )}
          </div>
          <div className="hidden sm:block text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-[0.9] tracking-tight">{appSettings.navTitle}</h1>
            <p className="text-[10px] font-bold text-[#049454] uppercase tracking-wider mt-1">{appSettings.navSubtitle}</p>
          </div>
        </div>

        {/* Search Section */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl relative">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search local..." 
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-3.5 pl-12 pr-12 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 focus:border-slate-300 transition-all shadow-sm"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-[#049454] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            )}
          </div>
          {searchTerm && (
            <button 
              type="button"
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          )}
        </form>

        {/* Action Section */}
        <div className="flex items-center gap-3">
          {/* Account Button */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 bg-[#f8fafd] dark:bg-slate-900 pl-2 pr-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 hover:bg-[#f1f5f9] transition-all group"
            >
              <div className={`w-9 h-9 ${user?.isAdmin ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'} text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm group-hover:shadow transition-all`}>
                {user ? (
                   <span className="text-white">{getUserInitials(user.name)}</span>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                )}
              </div>
              <div className="hidden lg:block text-left min-w-[70px]">
                <span className="block text-[9px] font-bold text-slate-400 uppercase leading-none mb-1 tracking-tight">ACCOUNT</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-200 leading-none">{user ? user.name.split(' ')[0] : 'Guest'}</span>
              </div>
              <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
            </button>
            
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-[130]" onClick={() => setIsMenuOpen(false)}></div>
                <div className="absolute right-0 top-full mt-4 w-80 bg-white dark:bg-[#0b1426] rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[140] p-5 text-left">
                  {!user && (
                    <button 
                      onClick={() => { onSignInClick(); setIsMenuOpen(false); }}
                      className="w-full bg-[#049454] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#037c46] transition-all mb-5 shadow-lg shadow-emerald-900/10"
                    >
                      Sign In / Register
                    </button>
                  )}
                  <div className="space-y-5">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">General</p>
                      {user?.isAdmin && (
                        <button 
                          onClick={() => { onOpenModal('admin-dashboard'); setIsMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 transition-all mb-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                          Admin Dashboard
                        </button>
                      )}
                      {user?.isSeller && (
                        <button 
                          onClick={() => { onOpenModal('seller-dashboard'); setIsMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-[#049454] bg-[#049454]/10 hover:bg-[#049454]/20 transition-all mb-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                          Seller Dashboard
                        </button>
                      )}
                      <button onClick={() => { onOpenModal('profile'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>Profile & Settings</button>
                      <button onClick={() => { onOpenModal('orders'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>My Orders</button>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Theme Appearance</p>
                      <div className="flex p-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800">
                        <button onClick={setLightTheme} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${!darkMode ? 'bg-white dark:bg-slate-700 text-[#049454] shadow-sm' : 'text-slate-400'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"/></svg>Light</button>
                        <button onClick={setDarkTheme} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${darkMode ? 'bg-white dark:bg-slate-700 text-[#049454] shadow-sm' : 'text-slate-400'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>Dark</button>
                      </div>
                    </div>
                    <div className="pt-4 border-t dark:border-slate-800">
                      <button onClick={() => { onOpenModal('help'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-[#049454] hover:bg-[#049454]/10 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536"/></svg>Help & Support</button>
                      {user && <button onClick={() => { onSignOut(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all mt-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7"/></svg>Sign Out</button>}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart Button */}
          <button 
            onClick={onCartClick} 
            className="w-12 h-12 flex items-center justify-center bg-[#0f172a] dark:bg-slate-800 text-white rounded-full hover:bg-slate-800 dark:hover:bg-slate-700 transition-all relative shadow-lg active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#049454] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800 animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;