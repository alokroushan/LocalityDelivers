
import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface OrderTrackingProps {
  order: Order;
  onBack: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order, onBack }) => {
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(12);
  const [status, setStatus] = useState('Partner assigned');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 0.5;
        if (next >= 100) return 100;
        return next;
      });
      setEta(prev => (prev > 1 ? prev - 0.05 : 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 20) setStatus('Partner arriving at store');
    else if (progress < 40) setStatus('Order is being picked up');
    else if (progress < 80) setStatus('Delivery partner is on the way');
    else if (progress < 100) setStatus('Partner is nearly here!');
    else setStatus('Partner has arrived');
  }, [progress]);

  // Simulated map coordinate interpolation
  const partnerPos = {
    x: 20 + (progress * 0.6),
    y: 70 - (progress * 0.4)
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b dark:border-slate-900 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Order Tracking</p>
          <h2 className="text-sm font-extrabold dark:text-white">#{order.id}</h2>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
        {/* Simplified Stylized Neighborhood Map */}
        <div className="absolute inset-0 opacity-40 dark:opacity-20">
          <div className="absolute top-[20%] left-[10%] w-[80%] h-1 bg-slate-300 dark:bg-slate-700 -rotate-12"></div>
          <div className="absolute top-[50%] left-[5%] w-[90%] h-1 bg-slate-300 dark:bg-slate-700 rotate-6"></div>
          <div className="absolute top-[10%] left-[40%] w-1 h-[80%] bg-slate-300 dark:bg-slate-700 rotate-12"></div>
          <div className="absolute top-[0%] left-[70%] w-1 h-[100%] bg-slate-300 dark:bg-slate-700 -rotate-6"></div>
        </div>

        {/* Store Marker */}
        <div className="absolute top-[70%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-10 text-center">
          <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center border-2 border-emerald-500 mb-2">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m-5 1h5m-5 4h5m-5 4h5"/></svg>
          </div>
          <p className="text-[10px] font-bold dark:text-white uppercase tracking-tighter">Store</p>
        </div>

        {/* User Marker */}
        <div className="absolute top-[30%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10 text-center">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl shadow-xl flex items-center justify-center text-white mb-2 animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          </div>
          <p className="text-[10px] font-bold dark:text-white uppercase tracking-tighter">You</p>
        </div>

        {/* Delivery Partner Marker */}
        <div 
          className="absolute z-20 transition-all duration-1000 ease-linear"
          style={{ top: `${partnerPos.y}%`, left: `${partnerPos.x}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-full animate-ping"></div>
            <div className="w-10 h-10 bg-[#049454] rounded-xl shadow-2xl flex items-center justify-center text-white ring-4 ring-white dark:ring-slate-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="p-6 bg-white dark:bg-slate-950 border-t dark:border-slate-900 rounded-t-[40px] shadow-2xl relative z-30 animate-in slide-in-from-bottom-full duration-700 delay-300">
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8"></div>
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-3xl font-extrabold text-[#049454] leading-tight mb-1">{Math.ceil(eta)} mins</h3>
            <p className="font-bold text-slate-900 dark:text-white">{status}</p>
          </div>
          <div className="text-right">
             <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-1">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover rounded-2xl" alt="Partner" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rahul K.</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-10 relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-[#049454] transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            Call Partner
          </button>
          <button className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 text-[#049454] rounded-2xl flex items-center justify-center border border-[#049454]/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
