import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  onBack: () => void;
  onSuccess: (instructions?: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onBack, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cash'>('card');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(instructions);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-[#049454] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Continue Shopping
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#049454] rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
             </div>
             <h1 className="text-2xl font-extrabold dark:text-white tracking-tight">Secure Checkout</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-[#049454] rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold dark:text-white">Delivery Address</h2>
                    <p className="text-sm text-slate-400">Where should we send your neighborhood favorites?</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Street Address</label>
                    <input required type="text" placeholder="e.g. 123 Maple Avenue" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white focus:ring-2 focus:ring-[#049454]/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Apt / Suite (Optional)</label>
                    <input type="text" placeholder="e.g. Apt 4B" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white focus:ring-2 focus:ring-[#049454]/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">City</label>
                    <input required type="text" placeholder="City" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white focus:ring-2 focus:ring-[#049454]/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Zip Code</label>
                    <input required type="text" placeholder="000000" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white focus:ring-2 focus:ring-[#049454]/20 outline-none transition-all" />
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold dark:text-white">Order Instructions</h2>
                    <p className="text-sm text-slate-400">Add any special notes for the local merchant.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Instructions</label>
                  <textarea 
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Please leave at the back gate, or wrap as a gift..." 
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white focus:ring-2 focus:ring-[#049454]/20 outline-none transition-all resize-none"
                  />
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold dark:text-white">Payment Method</h2>
                    <p className="text-sm text-slate-400">Choose how you'd like to pay for your order.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { id: 'card', name: 'Credit Card', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                    { id: 'upi', name: 'UPI ID', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                    { id: 'cash', name: 'Cash on Delivery', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`flex flex-col items-center justify-center p-6 rounded-[28px] border-2 transition-all ${paymentMethod === method.id ? 'bg-emerald-50 dark:bg-[#049454]/10 border-[#049454] text-[#049454]' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400'}`}
                    >
                      <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={method.icon}/></svg>
                      <span className="text-xs font-bold">{method.name}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Card Number</label>
                      <input required type="text" placeholder="0000 0000 0000 0000" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Expiry</label>
                        <input required type="text" placeholder="MM/YY" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">CVV</label>
                        <input required type="password" placeholder="***" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">UPI ID</label>
                      <input required type="text" placeholder="username@upi" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 transition-all" />
                      <p className="text-[10px] text-slate-400 ml-2">Enter your VPA ID to receive a payment request.</p>
                    </div>
                  </div>
                )}
              </section>

              <button 
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full bg-[#049454] text-white py-6 rounded-[32px] font-bold text-xl shadow-2xl shadow-emerald-900/20 hover:bg-[#037c46] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    Place Neighborhood Order • ₹{total}
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 sticky top-10">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <h3 className="text-xl font-bold mb-8 dark:text-white">Order Summary</h3>
              
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t dark:border-slate-800">
                <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
                  <span>Neighborhood Delivery</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
                  <span>Taxes (GST)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-xl font-bold dark:text-white pt-4 border-t border-slate-50 dark:border-slate-800 mt-4">
                  <span>Total</span>
                  <span className="text-[#049454]">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;