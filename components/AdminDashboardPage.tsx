
import React, { useState } from 'react';
import { Store, Product, HeroSlide, MerchantOnboardingRequest, AppSettings, CategoryItem } from '../types';

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
  onRejectMerchant: (requestId: string) => void;
  onUpdateAppSettings: (settings: AppSettings) => void;
  onUpdateCategories: (categories: CategoryItem[]) => void;
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
  onUpdateAppSettings,
  onUpdateCategories
}) => {
  const [activeTab, setActiveTab] = useState<'banners' | 'stores' | 'products' | 'approvals' | 'ui-editor'>('banners');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [viewingRequest, setViewingRequest] = useState<MerchantOnboardingRequest | null>(null);
  
  // Edit states
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editingProductData, setEditingProductData] = useState<{storeId: string, product: Product} | null>(null);

  const toggleStorePrivacy = (store: Store) => {
    onUpdateStore({ ...store, isPrivate: !store.isPrivate });
  };

  const toggleStoreVerified = (store: Store) => {
    onUpdateStore({ ...store, isVerified: !store.isVerified });
  };

  const toggleProductPrivacy = (storeId: string, product: Product) => {
    onUpdateProduct(storeId, { ...product, isPrivate: !product.isPrivate });
  };

  const handleUpdateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const newSlides = [...heroSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    onUpdateHeroSlides(newSlides);
  };

  const handleStoreEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStore) {
        onUpdateStore(editingStore);
        setEditingStore(null);
    }
  };

  const handleProductEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductData) {
        onUpdateProduct(editingProductData.storeId, editingProductData.product);
        setEditingProductData(null);
    }
  };

  const handleAppSettingsChange = (field: keyof AppSettings, value: string) => {
    onUpdateAppSettings({ ...appSettings, [field]: value });
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCats = [...categories];
    newCats[index] = { ...newCats[index], name: value };
    onUpdateCategories(newCats);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-[#049454] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to Site
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold dark:text-white tracking-tight">System Admin</h1>
            <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-600/20 uppercase tracking-widest">Master Access</div>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit mb-8 shadow-sm overflow-x-auto max-w-full">
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
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-[#049454] shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.id === 'approvals' && onboardingRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{onboardingRequests.filter(r => r.status === 'pending').length}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'ui-editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
              <h3 className="text-xl font-bold dark:text-white">General Copy Editor</h3>
              <div className="space-y-6">
                {[
                  { field: 'navTitle', label: 'Navbar Logo Text' },
                  { field: 'navSubtitle', label: 'Navbar Subtitle (Green Text)' },
                  { field: 'heroHeading', label: 'Hero Heading (White/Dark Part)' },
                  { field: 'heroHeadingHighlight', label: 'Hero Heading (Green Highlight)' },
                  { field: 'heroSubtext', label: 'Hero Subtext (Paragraph)' },
                  { field: 'dealsHeading', label: 'Main Section Heading' },
                  { field: 'dealsSubtext', label: 'Main Section Subtext' },
                  { field: 'footerText', label: 'Footer Copyright Text' }
                ].map((item) => (
                  <div key={item.field} className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{item.label}</label>
                    <input 
                      type="text" 
                      value={appSettings[item.field as keyof AppSettings]} 
                      onChange={(e) => handleAppSettingsChange(item.field as keyof AppSettings, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
              <h3 className="text-xl font-bold dark:text-white">Categories Editor</h3>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Icon: {cat.icon}</label>
                    <input 
                      type="text" 
                      value={cat.name} 
                      onChange={(e) => handleCategoryChange(idx, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" 
                    />
                  </div>
                ))}
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-[#049454]/10 text-[10px] text-[#049454] font-bold uppercase tracking-widest">
                Changes are applied instantly to the home navigation bar.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {heroSlides.map((slide, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold dark:text-white">Slide #{idx + 1}</h3>
                  <div className={`w-3 h-3 rounded-full ${slide.color.includes('bg-emerald') ? 'bg-emerald-500' : slide.color.includes('bg-amber') ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                </div>
                <div className="h-40 rounded-2xl overflow-hidden border dark:border-slate-800">
                  <img src={slide.image} className="w-full h-full object-cover" alt="Banner Preview" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Image URL</label>
                    <input 
                      type="text" 
                      value={slide.image} 
                      onChange={(e) => handleUpdateSlide(idx, 'image', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Category Link</label>
                      <input 
                        type="text" 
                        value={slide.category} 
                        onChange={(e) => handleUpdateSlide(idx, 'category', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Theme Color</label>
                      <select 
                        value={slide.color}
                        onChange={(e) => handleUpdateSlide(idx, 'color', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm dark:text-white outline-none"
                      >
                        <option value="bg-emerald-100/40 dark:bg-emerald-950/20">Emerald</option>
                        <option value="bg-amber-100/40 dark:bg-amber-950/20">Amber</option>
                        <option value="bg-orange-100/40 dark:bg-orange-950/20">Orange</option>
                        <option value="bg-sky-100/40 dark:bg-sky-950/20">Sky Blue</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {editingStore && (
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border-2 border-[#049454]/20 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold dark:text-white">Edit Store: {editingStore.name}</h2>
                        <button onClick={() => setEditingStore(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Cancel</button>
                    </div>
                    <form onSubmit={handleStoreEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Store Name</label>
                            <input required value={editingStore.name} onChange={e => setEditingStore({...editingStore, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <input required value={editingStore.category} onChange={e => setEditingStore({...editingStore, category: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea required rows={2} value={editingStore.description} onChange={e => setEditingStore({...editingStore, description: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 resize-none" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                            <input required value={editingStore.image} onChange={e => setEditingStore({...editingStore, image: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                        </div>
                        <div className="flex items-center gap-4 md:col-span-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
                          <div className="flex-1">
                              <p className="font-bold dark:text-white text-sm">Verified Merchant Badge</p>
                              <p className="text-xs text-slate-400">Enable this to show the blue checkmark next to the store name.</p>
                          </div>
                          <button 
                              type="button"
                              onClick={() => setEditingStore({...editingStore, isVerified: !editingStore.isVerified})}
                              className={`w-14 h-8 rounded-full relative transition-all ${editingStore.isVerified ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                          >
                              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${editingStore.isVerified ? 'left-7' : 'left-1'}`}></div>
                          </button>
                        </div>
                        <button type="submit" className="md:col-span-2 bg-[#049454] text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/10 hover:bg-[#037c46] transition-all">Save Store Changes</button>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
                <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Store</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                    {stores.map(store => (
                    <tr key={store.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                            <img src={store.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <p className="font-bold dark:text-white text-sm">{store.name}</p>
                                    {store.isVerified && (
                                        <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400">ID: {store.id}</p>
                            </div>
                        </div>
                        </td>
                        <td className="px-8 py-5 text-sm dark:text-slate-300">{store.category}</td>
                        <td className="px-8 py-5">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => toggleStorePrivacy(store)}
                                    className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${store.isPrivate ? 'bg-rose-50 text-rose-500 border border-rose-200' : 'bg-emerald-50 text-[#049454] border border-[#049454]/20'}`}
                                >
                                    {store.isPrivate ? 'Private' : 'Public'}
                                </button>
                                <button 
                                    onClick={() => toggleStoreVerified(store)}
                                    className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${store.isVerified ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}
                                >
                                    {store.isVerified ? 'Verified' : 'Unverified'}
                                </button>
                            </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setEditingStore(store)} className="p-2 text-slate-300 hover:text-[#049454] transition-colors" title="Edit Store Content">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                            </button>
                            <button onClick={() => onDeleteStore(store.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors" title="Delete Store">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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

        {activeTab === 'products' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {editingProductData && (
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border-2 border-[#049454]/20 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold dark:text-white">Edit Product: {editingProductData.product.name}</h2>
                        <button onClick={() => setEditingProductData(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Cancel</button>
                    </div>
                    <form onSubmit={handleProductEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                            <input required value={editingProductData.product.name} onChange={e => setEditingProductData({...editingProductData, product: {...editingProductData.product, name: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                            <input required type="number" value={editingProductData.product.price} onChange={e => setEditingProductData({...editingProductData, product: {...editingProductData.product, price: parseFloat(e.target.value)}})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea required rows={2} value={editingProductData.product.description} onChange={e => setEditingProductData({...editingProductData, product: {...editingProductData.product, description: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 resize-none" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                            <input required value={editingProductData.product.image} onChange={e => setEditingProductData({...editingProductData, product: {...editingProductData.product, image: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" />
                        </div>
                        <button type="submit" className="md:col-span-2 bg-[#049454] text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/10 hover:bg-[#037c46] transition-all">Save Product Changes</button>
                    </form>
                </div>
            )}

            {Object.entries(products).map(([storeId, storeProducts]) => {
              const store = stores.find(s => s.id === storeId);
              if (!store) return null;
              return (
                <div key={storeId} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b dark:border-slate-800 pb-4">
                    <img src={store.image} className="w-8 h-8 rounded-full object-cover" alt="" />
                    <h3 className="font-extrabold dark:text-white text-lg">{store.name}'s Catalog</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(storeProducts as Product[]).map(product => (
                      <div key={product.id} className="group relative flex flex-col gap-4 p-5 rounded-[28px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 transition-all hover:border-[#049454]/30 shadow-sm">
                        <div className="flex gap-4">
                            <img src={product.image} className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm" alt="" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold dark:text-white text-sm truncate pr-2">{product.name}</h4>
                                    <button 
                                        onClick={() => toggleProductPrivacy(storeId, product)}
                                        className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border transition-all ${product.isPrivate ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-emerald-50 text-[#049454] border-[#049454]/20'}`}
                                    >
                                        {product.isPrivate ? 'Private' : 'Public'}
                                    </button>
                                </div>
                                <p className="text-[#049454] font-extrabold text-sm mb-3">₹{product.price}</p>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button onClick={() => setViewingProduct(viewingProduct?.id === product.id ? null : product)} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-[#049454] transition-colors">{viewingProduct?.id === product.id ? 'Hide Details' : 'View Details'}</button>
                                    <span className="text-slate-200 dark:text-slate-800">•</span>
                                    <button onClick={() => setEditingProductData({storeId, product})} className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-700 transition-colors">Edit</button>
                                    <span className="text-slate-200 dark:text-slate-800">•</span>
                                    <button onClick={() => onDeleteProduct(storeId, product.id)} className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 hover:text-rose-600 transition-colors">Delete</button>
                                </div>
                            </div>
                        </div>
                        {viewingProduct?.id === product.id && (
                            <div className="mt-2 pt-3 border-t dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-200">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Description</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">"{product.description}"</p>
                            </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'approvals' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold dark:text-white">Merchant Approvals</h2>
                    <p className="text-sm text-slate-400">{onboardingRequests.length} Total Applications</p>
                </div>
                {onboardingRequests.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <p className="text-slate-400 font-bold">No merchant applications at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {onboardingRequests.map(req => (
                            <div key={req.id} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="shrink-0">
                                        <img src={req.photoUrl} className="w-32 h-32 rounded-[24px] object-cover shadow-md" alt="" />
                                        <div className={`mt-4 text-center py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${req.status === 'pending' ? 'bg-amber-50 text-amber-500' : req.status === 'approved' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                            {req.status}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold dark:text-white">{req.businessName}</h3>
                                                <p className="text-sm text-[#049454] font-bold">{req.category}</p>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Submitted: {req.submittedAt}</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-500">
                                            <p><span className="font-bold">Email:</span> {req.email}</p>
                                            <p><span className="font-bold">Phone:</span> {req.phone}</p>
                                            <p className="sm:col-span-2"><span className="font-bold">Address:</span> {req.address}</p>
                                        </div>
                                        <div className="pt-4 border-t dark:border-slate-800">
                                            <button onClick={() => setViewingRequest(viewingRequest?.id === req.id ? null : req)} className="text-[#049454] text-xs font-bold hover:underline mb-4 block">
                                                {viewingRequest?.id === req.id ? 'Hide Documents' : 'Review Documents & License'}
                                            </button>
                                            {viewingRequest?.id === req.id && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Proof Preview</p>
                                                        <div className="aspect-video bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border dark:border-slate-700 flex items-center justify-center">
                                                            <img src={req.idProofUrl} className="w-full h-full object-cover opacity-50" alt="ID Proof" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business License Preview</p>
                                                        <div className="aspect-video bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border dark:border-slate-700 flex items-center justify-center">
                                                            <img src={req.licenseUrl} className="w-full h-full object-cover opacity-50" alt="License" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {req.status === 'pending' && (
                                                <div className="flex gap-4 mt-6">
                                                    <button onClick={() => onApproveMerchant(req.id)} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/10">Approve & Verify</button>
                                                    <button onClick={() => onRejectMerchant(req.id)} className="flex-1 bg-rose-50 text-rose-500 border border-rose-200 py-3 rounded-xl font-bold text-sm">Reject Application</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
