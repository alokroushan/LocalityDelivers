
import React, { useState } from 'react';
import { Store, Product, HeroSlide } from '../types';

interface AdminDashboardPageProps {
  stores: Store[];
  products: Record<string, Product[]>;
  heroSlides: HeroSlide[];
  onBack: () => void;
  onUpdateHeroSlides: (slides: HeroSlide[]) => void;
  onUpdateStore: (store: Store) => void;
  onDeleteStore: (id: string) => void;
  onUpdateProduct: (storeId: string, product: Product) => void;
  onDeleteProduct: (storeId: string, productId: string) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  stores,
  products,
  heroSlides,
  onBack,
  onUpdateHeroSlides,
  onUpdateStore,
  onDeleteStore,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [activeTab, setActiveTab] = useState<'banners' | 'stores' | 'products'>('banners');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const toggleStorePrivacy = (store: Store) => {
    onUpdateStore({ ...store, isPrivate: !store.isPrivate });
  };

  const toggleProductPrivacy = (storeId: string, product: Product) => {
    onUpdateProduct(storeId, { ...product, isPrivate: !product.isPrivate });
  };

  const handleUpdateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const newSlides = [...heroSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    onUpdateHeroSlides(newSlides);
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
            { id: 'products', label: 'Inventory Audit', icon: '📦' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-[#049454] shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

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
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto animate-in slide-in-from-bottom-4 duration-500">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Store</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visibility</th>
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
                          <p className="font-bold dark:text-white text-sm">{store.name}</p>
                          <p className="text-[10px] text-slate-400">ID: {store.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm dark:text-slate-300">{store.category}</td>
                    <td className="px-8 py-5 text-sm font-bold text-amber-500">★ {store.rating}</td>
                    <td className="px-8 py-5">
                      <button 
                        onClick={() => toggleStorePrivacy(store)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${store.isPrivate ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500 border border-rose-200' : 'bg-emerald-50 dark:bg-emerald-950/30 text-[#049454] border border-[#049454]/20'}`}
                      >
                        {store.isPrivate ? 'Private' : 'Public'}
                      </button>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => onDeleteStore(store.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
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
                      <div key={product.id} className="group relative flex flex-col gap-4 p-5 rounded-[28px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 transition-all hover:border-[#049454]/30">
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
                                
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setViewingProduct(viewingProduct?.id === product.id ? null : product)}
                                        className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-[#049454] transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        {viewingProduct?.id === product.id ? 'Hide Details' : 'View Details'}
                                    </button>
                                    <div className="w-px h-3 bg-slate-200 dark:bg-slate-700"></div>
                                    <button 
                                        onClick={() => onDeleteProduct(storeId, product.id)}
                                        className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 hover:text-rose-600 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                        Delete
                                    </button>
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
      </div>

      {/* Detail Overlay / Modal could go here if needed, but the inline expansion is cleaner */}
    </div>
  );
};

export default AdminDashboardPage;
