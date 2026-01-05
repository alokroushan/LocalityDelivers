
import React from 'react';
import { Store } from '../types';

interface StoreCardProps {
  store: Store;
  onClick: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-[#049454]/20 dark:hover:border-[#049454]/40 transition-all cursor-pointer flex flex-col group shadow-sm hover:shadow-xl dark:shadow-none"
    >
      <div className="h-56 relative overflow-hidden">
        <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-bold text-[#049454] tracking-wider uppercase shadow-sm">
          {store.deliveryTime}
        </div>
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xl tracking-tight leading-tight text-slate-900 dark:text-white">{store.name}</h4>
                {store.isVerified && (
                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                )}
            </div>
            {store.isVerified && <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Verified Merchant</p>}
          </div>
          <div className="flex items-center text-amber-500 font-bold text-sm bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-lg">
            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {store.rating}
          </div>
        </div>
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed mb-6">
          {store.description}
        </p>
        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600">{store.category}</span>
          <span className="text-[#049454] text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">Explore &rarr;</span>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
