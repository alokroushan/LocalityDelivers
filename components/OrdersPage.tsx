
import React from 'react';
import { Order } from '../types';

interface OrdersPageProps {
  orders: Order[];
  onBack: () => void;
  onCancelOrder?: (orderId: string) => void;
  onTrackOrder?: (orderId: string) => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ orders, onBack, onCancelOrder, onTrackOrder }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-[#049454] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to Feed
          </button>
          <h1 className="text-2xl font-extrabold dark:text-white tracking-tight">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 border-dashed">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </div>
            <h2 className="text-xl font-bold dark:text-white mb-2">No orders yet</h2>
            <p className="text-slate-400 mb-8 max-w-xs mx-auto font-medium">Your local neighborhood gems are waiting to be discovered.</p>
            <button onClick={onBack} className="bg-[#049454] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-900/10">Start Exploring</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b dark:border-slate-800">
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${order.status === 'Cancelled' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-950/30 text-[#049454]'}`}>
                      {order.status === 'Cancelled' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6"/></svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order #{order.id}</p>
                      <p className="font-bold dark:text-white">{order.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400">
                      {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-[#049454]' : 
                      order.status === 'Cancelled' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500' : 
                      'bg-blue-50 dark:bg-blue-950/30 text-blue-500'
                    }`}>
                      {order.status}
                    </div>
                    <div className="text-xl font-extrabold dark:text-white ml-2">
                      ₹{order.total}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-600 dark:text-slate-300">{item.name} <span className="text-slate-400 ml-2">x{item.quantity}</span></span>
                      <span className="text-slate-900 dark:text-white font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  {(order.status === 'Processing' || order.status === 'Out for Delivery') && onTrackOrder && (
                    <button 
                      onClick={() => onTrackOrder(order.id)}
                      className="bg-[#049454] text-white px-8 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-emerald-900/10 hover:bg-[#037c46] transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                      Track Live Order
                    </button>
                  )}
                  {order.status === 'Delivered' && (
                    <button className="bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">Reorder Items</button>
                  )}
                  {order.status === 'Processing' && onCancelOrder && (
                    <button 
                      onClick={() => onCancelOrder(order.id)}
                      className="text-rose-500 font-bold text-xs hover:underline"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button className="ml-auto text-xs font-bold text-slate-400 flex items-center gap-2 hover:text-slate-600 dark:hover:text-slate-200">
                    Need Help? 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
