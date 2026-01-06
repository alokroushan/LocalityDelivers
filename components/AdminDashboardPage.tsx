import React, { useState, useEffect, useRef } from 'react';
import { Store, Product, HeroSlide, MerchantOnboardingRequest, AppSettings, CategoryItem, ChatMessage } from '../types';

interface AdminDashboardPageProps {
  stores: Store[];
  products: Record<string, Product[]>;
  heroSlides: HeroSlide[];
  onboardingRequests: MerchantOnboardingRequest[];
  appSettings: AppSettings;
  categories: CategoryItem[];
  onBack: () => void;
  onUpdateHeroSlides: (slides: HeroSlide[]) => void;
  onUpdateStore: (store: Store) => void;
  onDeleteStore: (id: string) => void;
  onUpdateProduct: (storeId: string, product: Product) => void;
  onDeleteProduct: (storeId: string, productId: string) => void;
  onApproveMerchant: (requestId: string) => void;
  onRejectMerchant: (requestId: string, feedback: string) => void;
  onHoldMerchant: (requestId: string, feedback: string) => void;
  onUpdateAppSettings: (settings: AppSettings) => void;
  onUpdateCategories: (categories: CategoryItem[]) => void;
  onSendChatMessage?: (requestId: string, sender: 'admin', text: string) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  stores,
  products,
  heroSlides,
  onboardingRequests,
  appSettings,
  categories,
  onBack,
  onUpdateHeroSlides,
  onUpdateStore,
  onDeleteStore,
  onUpdateProduct,
  onDeleteProduct,
  onApproveMerchant,
  onRejectMerchant,
  onHoldMerchant,
  onUpdateAppSettings,
  onUpdateCategories,
  onSendChatMessage
}) => {
  const [activeTab, setActiveTab] = useState<'banners' | 'stores' | 'products' | 'approvals' | 'ui-editor'>('banners');
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [editingProductData, setEditingProductData] = useState<{storeId: string, product: Product} | null>(null);
  const [editingStoreData, setEditingStoreData] = useState<Store | null>(null);
  const [adminFeedback, setAdminFeedback] = useState<Record<string, string>>({});
  const chatEndRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    (Object.values(chatEndRefs.current) as (HTMLDivElement | null)[]).forEach(el => el?.scrollIntoView({ behavior: 'smooth' }));
  }, [onboardingRequests]);

  const toggleStorePrivacy = (store: Store) => onUpdateStore({ ...store, isPrivate: !store.isPrivate });
  const toggleStoreVerified = (store: Store) => onUpdateStore({ ...store, isVerified: !store.isVerified });
  const toggleProductPrivacy = (storeId: string, product: Product) => onUpdateProduct(storeId, { ...product, isPrivate: !product.isPrivate });

  const handleUpdateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const newSlides = [...heroSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    onUpdateHeroSlides(newSlides);
  };

  const handleSendChat = (requestId: string, e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as any).message;
    if (input.value.trim() && onSendChatMessage) {
      onSendChatMessage(requestId, 'admin', input.value);
      input.value = '';
    }
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductData) {
      onUpdateProduct(editingProductData.storeId, editingProductData.product);
      setEditingProductData(null);
    }
  };

  const handleSaveStoreEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStoreData) {
      onUpdateStore(editingStoreData);
      setEditingStoreData(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure? This will hide the store from the platform.')) {
      onDeleteStore(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-6 md:pt-10 pb-24 px-4 md:px-6 animate-in fade-in duration-500 overflow-x-hidden relative text-left">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-[#049454] transition-all w-fit">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to Site
          </button>
          <div className="flex items-center gap-3 md:gap-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Admin</h1>
            <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-widest whitespace-nowrap">Master Access</div>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-fit mb-8 shadow-sm overflow-x-auto custom-scrollbar whitespace-nowrap">
          {[
            { id: 'banners', label: 'Hero Banners', icon: '🖼️' },
            { id: 'stores', label: 'Manage Stores', icon: '🏪' },
            { id: 'products', label: 'Inventory Audit', icon: '📦' },
            { id: 'approvals', label: 'Approvals', icon: '✅' },
            { id: 'ui-editor', label: 'UI Editor', icon: '✍️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 md:px-8 py-3 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-[#049454] shadow-md' : 'text-slate-500 hover:text-slate-600'}`}
            >
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'banners' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {heroSlides.map((slide, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-[28px] md:rounded-[32px] p-5 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                <h3 className="font-bold text-slate-900 dark:text-white">Slide #{idx + 1}</h3>
                <div className="h-32 md:h-40 rounded-2xl overflow-hidden border dark:border-slate-800">
                  <img src={slide.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Image URL</label>
                    <input type="text" value={slide.image} onChange={(e) => handleUpdateSlide(idx, 'image', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#049454]/30 font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Category Label</label>
                    <input type="text" value={slide.category} onChange={(e) => handleUpdateSlide(idx, 'category', e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#049454]/30 font-bold" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-800 font-bold text-[10px] uppercase tracking-widest text-slate-400">
                    <th className="px-6 md:px-8 py-4 md:py-5">Store</th>
                    <th className="px-6 md:px-8 py-4 md:py-5">Category</th>
                    <th className="px-6 md:px-8 py-4 md:py-5">Status</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {stores.map(store => (
                    <tr key={store.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-xs md:text-sm">
                      <td className="px-6 md:px-8 py-4 md:py-5">
                        <div className="flex items-center gap-3 md:gap-4">
                          <img src={store.image} className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover shrink-0" alt="" />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate">{store.name}</p>
                            <p className="text-[9px] md:text-[10px] text-slate-400">ID: {store.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-5 text-slate-700 dark:text-slate-300 whitespace-nowrap">{store.category}</td>
                      <td className="px-6 md:px-8 py-4 md:py-5">
                        <div className="flex gap-1.5 md:gap-2">
                          <button onClick={() => toggleStorePrivacy(store)} className={`px-2 md:px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase border transition-all ${store.isPrivate ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-emerald-50 text-[#049454] border-[#049454]/20'}`}>
                            {store.isPrivate ? 'Private' : 'Public'}
                          </button>
                          <button onClick={() => toggleStoreVerified(store)} className={`px-2 md:px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase border transition-all ${store.isVerified ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                            {store.isVerified ? 'Verified' : 'Unverified'}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-5">
                        <div className="flex justify-end items-center gap-3">
                          <button onClick={() => setEditingStoreData(store)} className="text-slate-300 hover:text-blue-500 transition-colors">
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                          </button>
                          <button onClick={() => handleDeleteClick(store.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
            {onboardingRequests.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-[32px] p-24 text-center border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-slate-400 font-bold text-lg">No pending applications</p>
                <p className="text-slate-300 text-sm mt-1 font-medium">All clear for now!</p>
              </div>
            ) : (
              onboardingRequests.map(req => (
                <div key={req.id} className="bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col lg:flex-row">
                  <div className="lg:w-96 bg-slate-50 dark:bg-slate-900/50 p-8 md:p-10 border-r border-slate-100 dark:border-slate-800">
                    <div className="relative group mb-8">
                      <div className="aspect-square w-full rounded-[40px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                        <img src={req.photoUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Business Logo" />
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Merchant Category</p>
                        <span className="inline-block px-4 py-2 bg-[#049454]/10 text-[#049454] rounded-2xl text-xs font-bold border border-[#049454]/20 uppercase">{req.category}</span>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] px-1">Supporting Documents</p>
                        {req.idProofUrl && (
                          <a href={req.idProofUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-xl flex items-center justify-center">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                               </div>
                               <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Identity Proof</span>
                             </div>
                             <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                          </a>
                        )}
                        {req.licenseUrl && (
                          <a href={req.licenseUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-xl flex items-center justify-center">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                               </div>
                               <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Business License</span>
                             </div>
                             <svg className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-8 md:p-12 flex flex-col text-left">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                      <div className="space-y-2">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Application ID: {req.id}</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter leading-tight">{req.businessName}</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{req.address}</p>
                      </div>
                      <div className={`px-6 py-3 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest border-2 shadow-sm whitespace-nowrap ${
                        req.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        req.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        req.status === 'on_hold' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>{req.status.replace('_', ' ')}</div>
                    </div>

                    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950/40 rounded-[40px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner mb-12">
                      <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto p-8 space-y-6 custom-scrollbar bg-white/30 dark:bg-slate-900/10">
                         {req.chatHistory?.map((msg, i) => (
                           <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] space-y-1`}>
                                <div className={`px-6 py-3.5 rounded-[24px] text-sm font-bold shadow-sm ${msg.sender === 'admin' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700'}`}>{msg.text}</div>
                                <p className={`text-[9px] font-bold text-slate-400 px-2 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              </div>
                           </div>
                         ))}
                         <div ref={(el) => { chatEndRefs.current[req.id] = el; }} />
                      </div>
                      <form onSubmit={(e) => handleSendChat(req.id, e)} className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-4">
                         <input name="message" placeholder="Communicate with merchant..." className="flex-1 bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-2xl text-sm font-bold outline-none text-slate-900 dark:text-white" />
                         <button type="submit" className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></button>
                      </form>
                    </div>

                    <div className="pt-10 border-t border-slate-100 dark:border-slate-800 space-y-8">
                      <textarea value={adminFeedback[req.id] || req.adminFeedback || ''} onChange={(e) => setAdminFeedback({ ...adminFeedback, [req.id]: e.target.value })} placeholder="Application decision feedback..." className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 resize-none font-bold min-h-[120px]" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => onApproveMerchant(req.id)} className="bg-[#049454] text-white py-5 rounded-2xl font-extrabold text-xs uppercase tracking-widest shadow-xl">Approve & Launch</button>
                        <button onClick={() => onHoldMerchant(req.id, adminFeedback[req.id] || '')} className="bg-blue-50 text-blue-600 py-5 rounded-2xl font-extrabold text-xs uppercase tracking-widest border-2 border-blue-100">Request Info</button>
                        <button onClick={() => onRejectMerchant(req.id, adminFeedback[req.id] || '')} className="bg-rose-50 text-rose-500 py-5 rounded-2xl font-extrabold text-xs uppercase tracking-widest border-2 border-rose-100">Reject</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {Object.entries(products).map(([storeId, storeProducts]: [string, Product[]]) => {
              const store = stores.find(s => s.id === storeId);
              if (!store) return null;
              return (
                <div key={storeId} className="bg-white dark:bg-slate-900 rounded-[28px] md:rounded-[40px] p-5 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm text-left">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg md:text-2xl mb-6 md:mb-8 border-b dark:border-slate-800 pb-4 md:pb-6">{store.name}'s Catalog</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    {storeProducts.map(product => (
                      <div key={product.id} className="p-4 md:p-6 rounded-[24px] md:rounded-[32px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4 md:gap-6 group">
                        <img src={product.image} className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl object-cover shrink-0" alt={product.name} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-lg truncate pr-2">{product.name}</h4>
                          <p className="text-[#049454] font-extrabold text-base md:text-xl mb-3 md:mb-4">₹{product.price}</p>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setEditingProductData({ storeId, product })} className="text-[10px] md:text-xs font-bold text-blue-500 hover:underline">Edit</button>
                            <button onClick={() => onDeleteProduct(storeId, product.id)} className="text-[10px] md:text-xs font-bold text-rose-500 hover:underline">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'ui-editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 animate-in slide-in-from-bottom-4 duration-500 text-left">
            <div className="bg-white dark:bg-slate-900 rounded-[28px] md:rounded-[32px] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 md:space-y-8">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Copy Editor</h3>
              <div className="space-y-5 md:space-y-6">
                {Object.keys(appSettings).map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">{field}</label>
                    <input type="text" value={appSettings[field as keyof AppSettings]} onChange={(e) => onUpdateAppSettings({ ...appSettings, [field]: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#049454]/30 font-bold" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-[28px] md:rounded-[32px] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 md:space-y-8">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Categories Editor</h3>
              <div className="space-y-5 md:space-y-6">
                {categories.map((cat, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={cat.name} onChange={(e) => { const c = [...categories]; c[idx].name = e.target.value; onUpdateCategories(c); }} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-lg text-xs font-bold" />
                    <input type="text" value={cat.icon} onChange={(e) => { const c = [...categories]; c[idx].icon = e.target.value; onUpdateCategories(c); }} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-lg text-xs font-bold" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProductData && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingProductData(null)}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 text-left max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-8 border-b dark:border-slate-800 shrink-0">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Product</h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              <form onSubmit={handleSaveProductEdit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Name</label>
                  <input type="text" value={editingProductData.product.name} onChange={(e) => setEditingProductData({...editingProductData, product: {...editingProductData.product, name: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Price</label>
                  <input type="number" value={editingProductData.product.price} onChange={(e) => setEditingProductData({...editingProductData, product: {...editingProductData.product, price: parseFloat(e.target.value)}})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Image URL</label>
                  <input type="text" value={editingProductData.product.image} onChange={(e) => setEditingProductData({...editingProductData, product: {...editingProductData.product, image: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Description</label>
                  <textarea value={editingProductData.product.description} onChange={(e) => setEditingProductData({...editingProductData, product: {...editingProductData.product, description: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white resize-none font-bold outline-none" rows={3} />
                </div>
              </form>
            </div>
            <div className="p-8 border-t dark:border-slate-800 flex gap-4 shrink-0">
                <button type="button" onClick={() => setEditingProductData(null)} className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-2xl font-bold">Cancel</button>
                <button type="button" onClick={handleSaveProductEdit} className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Store Modal with RECOVERY CREDENTIALS */}
      {editingStoreData && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingStoreData(null)}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 text-left max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Store Profile</h2>
                <button onClick={() => setEditingStoreData(null)} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              <form onSubmit={handleSaveStoreEdit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Store Name</label>
                      <input type="text" value={editingStoreData.name} onChange={(e) => setEditingStoreData({...editingStoreData, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Category</label>
                      <input type="text" value={editingStoreData.category} onChange={(e) => setEditingStoreData({...editingStoreData, category: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold" />
                    </div>
                </div>

                <div className="p-6 bg-amber-50 dark:bg-amber-950/20 rounded-[28px] border-2 border-amber-100 dark:border-amber-900/50 space-y-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div>
                      <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-[0.15em]">Merchant Access Recovery</p>
                    </div>
                    <p className="text-[10px] text-amber-500/80 font-medium px-1 leading-relaxed">Changes here allow the seller to log in if they forget their old account. This email becomes their primary key.</p>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Recovery Email</label>
                        <input type="email" value={editingStoreData.email || ''} onChange={(e) => setEditingStoreData({...editingStoreData, email: e.target.value})} placeholder="merchant@example.com" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/80 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/30 font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Recovery Password</label>
                        <input type="text" value={editingStoreData.password || ''} onChange={(e) => setEditingStoreData({...editingStoreData, password: e.target.value})} placeholder="Set new fallback password" title="Merchant can use this password to sign in if they lose access" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/80 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/30 font-bold" />
                      </div>
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Image URL</label>
                  <input type="text" value={editingStoreData.image} onChange={(e) => setEditingStoreData({...editingStoreData, image: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Description</label>
                  <textarea value={editingStoreData.description} onChange={(e) => setEditingStoreData({...editingStoreData, description: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-bold" rows={3} />
                </div>
              </form>
            </div>
            <div className="p-8 border-t dark:border-slate-800 flex gap-4 shrink-0">
                <button type="button" onClick={() => setEditingStoreData(null)} className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold">Cancel</button>
                <button type="button" onClick={handleSaveStoreEdit} className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/20">Update Store</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;