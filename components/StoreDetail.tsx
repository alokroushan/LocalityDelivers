
import React from 'react';
import { Store, Product } from '../types';

interface StoreDetailProps {
  store: Store;
  products: Product[];
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const StoreDetail: React.FC<StoreDetailProps> = ({ store, products, onBack, onAddToCart, onProductClick }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative h-[450px] w-full overflow-hidden">
        <img src={store.image} alt={store.name} className="w-full h-full object-cover brightness-75 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        
        <div className="absolute top-24 left-6 right-6 max-w-7xl mx-auto">
          <button 
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-white font-bold text-sm bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to feed
          </button>
          
          <div className="space-y-4">
            <span className="bg-[#049454] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              {store.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter">
              {store.name}
            </h1>
            <p className="text-slate-200 text-lg max-w-2xl leading-relaxed font-medium">
              {store.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center md:border-r dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</p>
            <div className="flex items-center justify-center gap-1.5 text-amber-500 font-bold text-xl">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              {store.rating}
            </div>
          </div>
          <div className="text-center md:border-r dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Delivers In</p>
            <p className="text-xl font-bold dark:text-white">{store.deliveryTime}</p>
          </div>
          <div className="text-center md:border-r dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fee</p>
            <p className="text-xl font-bold text-[#049454]">₹{store.deliveryFee}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Merchant Status</p>
            <p className="text-xl font-bold text-blue-500">Verified Local</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold mb-12 dark:text-white">Shop the Collection</h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div 
                key={product.id} 
                className="bg-white dark:bg-slate-900 rounded-[32px] p-4 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group cursor-pointer"
                onClick={() => onProductClick(product)}
              >
                <div className="h-48 rounded-[24px] overflow-hidden mb-6">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg dark:text-white">{product.name}</h3>
                    <span className="text-[#049454] font-bold">₹{product.price}</span>
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mb-6 line-clamp-2">{product.description}</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="w-full bg-[#049454] text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/10 hover:bg-[#037c46] transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 font-bold">Catalog coming soon! Check back later today.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StoreDetail;
