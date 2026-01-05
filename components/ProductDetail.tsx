
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  similarProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onStoreClick: (storeId: string) => void;
  onProductClick: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  similarProducts, 
  onBack, 
  onAddToCart, 
  onBuyNow,
  onProductClick
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-[#049454] transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        Back to merchant
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        <div className="space-y-4">
          <div className="aspect-square bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 ring-[#049454] transition-all">
                  <img src={product.image} alt={`${product.name} thumbnail`} className="w-full h-full object-cover opacity-60" />
               </div>
             ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-[#049454] font-bold text-xs uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
              In Stock
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center text-amber-500 font-bold">
              <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              {product.rating} <span className="text-slate-400 font-medium ml-2">({product.reviewCount} neighborhood reviews)</span>
            </div>
          </div>

          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            ₹{product.price}
          </div>

          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10 font-medium">
            {product.description}
          </p>

          <div className="space-y-4 mb-12">
            <div className="flex gap-4">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-1 bg-white dark:bg-slate-900 border-2 border-[#049454] text-[#049454] py-4 rounded-2xl font-bold hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all ${isWishlisted ? 'bg-rose-50 border-rose-500 text-rose-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}
              >
                <svg className="w-6 h-6" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </button>
            </div>
            <button 
              onClick={() => onBuyNow(product)}
              className="w-full bg-[#049454] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/10 hover:bg-[#037c46] transition-all"
            >
              Buy it Now
            </button>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#049454] rounded-2xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div>
              <p className="font-bold text-sm dark:text-white">Lightning Fast Delivery</p>
              <p className="text-xs text-slate-500">Your local courier is ready to pick this up.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-24">
        <h3 className="text-2xl font-bold mb-10 dark:text-white">Recent Neighborhood Feedback</h3>
        <div className="space-y-6">
          {[
            { user: "Sarah K.", rating: 5, comment: "Absolutely fresh! You can tell it was harvested just this morning. Highly recommend supporting this shop." },
            { user: "Mike R.", rating: 4, comment: "Great quality. A bit pricier than the big stores but the flavor difference is night and day." }
          ].map((rev, i) => (
            <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-900 dark:text-white">{rev.user}</span>
                <div className="flex text-amber-500">
                  {Array.from({length: rev.rating}).map((_, i) => <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-2xl font-bold dark:text-white mb-2">Similar Items Nearby</h3>
            <p className="text-slate-400 text-sm">Explore related products from other local merchants.</p>
          </div>
          <button className="text-[#049454] font-bold text-sm">View All Recommendations</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {similarProducts.map(p => (
            <div 
              key={p.id} 
              className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => onProductClick(p)}
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h4 className="font-bold text-sm mb-1 dark:text-white group-hover:text-[#049454] transition-colors">{p.name}</h4>
              <div className="flex justify-between items-center">
                <span className="text-[#049454] font-bold text-sm">₹{p.price}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Local Merchant</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
