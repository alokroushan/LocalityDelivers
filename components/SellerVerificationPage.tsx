import React, { useState } from 'react';

interface SellerVerificationPageProps {
  onBack: () => void;
  onComplete: (storeDetails?: any) => void;
}

const SellerVerificationPage: React.FC<SellerVerificationPageProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    gstin: '',
    category: 'Artisanal Bakery',
    customCategory: '',
    phone: '',
    address: '',
    photoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    idProofUrl: '',
    licenseUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate verification delay
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete({
        businessName: formData.businessName,
        category: formData.category === 'Other' ? formData.customCategory : formData.category,
        photoUrl: formData.photoUrl,
        phone: formData.phone,
        address: formData.address,
        idProofUrl: formData.idProofUrl || 'https://placeholder.com/id-proof.pdf', 
        licenseUrl: formData.licenseUrl || 'https://placeholder.com/license.pdf',
        description: `Local ${formData.category === 'Other' ? formData.customCategory : formData.category} serving the neighborhood.`
      });
    }, 2000);
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

  const categoryOptions = [
    'Artisanal Bakery',
    'Local Grocery',
    'Stationary Shop',
    'Pizza Corner',
    'Hostel / PG',
    'Plastic Shop',
    'Home Services',
    'Health & Wellness',
    'Flower Shop',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-24 px-6 animate-in fade-in duration-500 text-left">
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
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Merchant Onboarding</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">To keep our neighborhood safe, please provide your business details for verification.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            {step === 1 ? (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                    <input required type="text" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} placeholder="e.g. Bansal Stationaries" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">GSTIN Number</label>
                    <input required type="text" value={formData.gstin} onChange={(e) => setFormData({...formData, gstin: e.target.value})} placeholder="22AA33300JH" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Business Category</label>
                    <div className="space-y-4">
                        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20">
                            {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        {formData.category === 'Other' && (
                            <input required type="text" placeholder="Type your category" value={formData.customCategory} onChange={(e) => setFormData({...formData, customCategory: e.target.value})} className="w-full px-5 py-4 bg-emerald-50/50 dark:bg-slate-800 border border-[#049454]/20 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/40" />
                        )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Contact</label>
                    <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 90000 00000" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Store Photo URL</label>
                  <input required type="url" value={formData.photoUrl} onChange={(e) => setFormData({...formData, photoUrl: e.target.value})} placeholder="Paste a link to your store's image..." className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Store Address</label>
                  <textarea required rows={3} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Full physical address of your store..." className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 resize-none" />
                </div>
                <button type="button" onClick={() => setStep(2)} className="w-full bg-slate-900 dark:bg-slate-800 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-all">
                  Continue to Documents
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Identity Proof URL (Google Drive/Hosted PDF)</label>
                    <input required type="url" value={formData.idProofUrl} onChange={(e) => setFormData({...formData, idProofUrl: e.target.value})} placeholder="Link to Aadhar/PAN/License" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Business License URL (Hosted PDF/Image)</label>
                    <input required type="url" value={formData.licenseUrl} onChange={(e) => setFormData({...formData, licenseUrl: e.target.value})} placeholder="Link to Trade License/FSSAI" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-5 rounded-2xl font-bold">Back</button>
                  <button type="submit" className="flex-[2] bg-[#049454] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/10 hover:bg-[#037c46] transition-all">Submit for Verification</button>
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