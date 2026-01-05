
import React, { useState } from 'react';

interface SellerVerificationPageProps {
  onBack: () => void;
  onComplete: () => void;
}

const SellerVerificationPage: React.FC<SellerVerificationPageProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate verification process
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 3000);
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 border-4 border-[#049454] border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-3xl font-extrabold dark:text-white mb-2">Verifying Your Store</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">We're checking your business credentials to ensure a safe community for everyone.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-[#049454] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to Role Selection
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[#049454]' : 'bg-slate-200'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[#049454]' : 'bg-slate-200'}`}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 md:p-16 border border-slate-100 dark:border-slate-800 shadow-xl">
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold dark:text-white tracking-tight mb-4">Merchant Onboarding</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">To keep our neighborhood safe, please provide your business details for verification.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            {step === 1 ? (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                    <input required type="text" placeholder="e.g. Royal Bakes & More" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">GSTIN Number</label>
                    <input required type="text" placeholder="22AAAAA0000A1Z5" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Business Category</label>
                    <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20">
                      <option>Artisanal Bakery</option>
                      <option>Local Grocery</option>
                      <option>Home Services</option>
                      <option>Health & Wellness</option>
                      <option>Flower Shop</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Contact</label>
                    <input required type="tel" placeholder="+91 90000 00000" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Store Address</label>
                  <textarea required rows={3} placeholder="Full physical address of your store..." className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 resize-none" />
                </div>
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-slate-900 dark:bg-slate-800 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-all"
                >
                  Continue to Documents
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] text-center">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 text-[#049454] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  </div>
                  <h3 className="font-bold dark:text-white mb-2">Upload Identity Proof</h3>
                  <p className="text-xs text-slate-400">Aadhar, Pan Card, or Driving License (PDF/JPG)</p>
                </div>

                <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] text-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <h3 className="font-bold dark:text-white mb-2">Business License</h3>
                  <p className="text-xs text-slate-400">Trade License or FSSAI Certificate</p>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-5 rounded-2xl font-bold"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-[#049454] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/10 hover:bg-[#037c46] transition-all"
                  >
                    Submit for Verification
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerVerificationPage;
