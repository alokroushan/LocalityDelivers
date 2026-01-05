import React, { useState } from 'react';
import { Store, Product, Order } from '../types';

interface SellerDashboardPageProps {
  store: Store;
  products: Product[];
  orders: Order[];
  onBack: () => void;
  onUpdateStore: (store: Store) => void;
  onDeleteStore?: (id: string) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onProcessOrder: (orderId: string, note: string) => void;
}

const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({ 
  store, 
  products, 
  orders,
  onBack, 
  onUpdateStore,
  onDeleteStore,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onProcessOrder
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [showForm, setShowForm] = useState<'add' | 'edit' | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderNotes, setOrderNotes] = useState<Record<string, string>>({});

  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400'
  });

  const [storeFormData, setStoreFormData] = useState({
    name: store.name,
    category: store.category,
    description: store.description,
    image: store.image
  });

  const handleAddClick = () => {
    setProductFormData({
      name: '',
      price: '',
      description: '',
      category: 'Bakery',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400'
    });
    setShowForm('add');
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: 'Bakery',
      image: product.image
    });
    setShowForm('edit');
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: showForm === 'edit' && editingProduct ? editingProduct.id : `p-${Date.now()}`,
      storeId: store.id,
      name: productFormData.name,
      price: parseFloat(productFormData.price),
      description: productFormData.description,
      image: productFormData.image,
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 0
    };

    if (showForm === 'add') {
      onAddProduct(product);
    } else if (showForm === 'edit') {
      onUpdateProduct(product);
    }
    
    setShowForm(null);
    setEditingProduct(null);
  };

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStore({
      ...store,
      name: storeFormData.name,
      category: storeFormData.category,
      description: storeFormData.description,
      image: storeFormData.image
    });
    alert('Store details updated successfully!');
  };

  const handleDeleteStoreClick = () => {
    if (window.confirm('Are you absolutely sure you want to delete your store? This action cannot be undone.')) {
        onDeleteStore?.(store.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-24 px-6 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-[#049454] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to Feed
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-extrabold dark:text-white tracking-tight">Seller Dashboard</h1>
            <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-[#049454] text-[10px] font-bold rounded-full border border-[#049454]/20 uppercase tracking-widest">Active Store</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="h-32 w-full rounded-2xl overflow-hidden mb-6">
                <img src={store.image} className="w-full h-full object-cover" alt={store.name} />
              </div>
              <h2 className="text-xl font-bold dark:text-white mb-2">{store.name}</h2>
              <p className="text-xs text-slate-400 font-medium mb-6">{store.description}</p>
              
              <div className="space-y-4 pt-6 border-t dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total Products</span>
                  <span className="font-bold dark:text-white">{products.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Incoming Orders</span>
                  <span className="font-bold dark:text-white">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Store Rating</span>
                  <span className="font-bold text-amber-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    {store.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#049454] rounded-[32px] p-8 text-white">
              <h3 className="font-bold mb-2">Seller Tips</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">Diversify your services! You can list anything from stationery to PG accommodation to attract more neighbors.</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-fit mb-4 overflow-x-auto max-w-full">
              <button 
                onClick={() => setActiveTab('products')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-white dark:bg-slate-800 text-[#049454] shadow-sm' : 'text-slate-400'}`}
              >
                Products
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-white dark:bg-slate-800 text-[#049454] shadow-sm' : 'text-slate-400'}`}
              >
                Orders {orders.length > 0 && <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{orders.length}</span>}
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-white dark:bg-slate-800 text-[#049454] shadow-sm' : 'text-slate-400'}`}
              >
                Store Settings
              </button>
            </div>

            {activeTab === 'products' && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold dark:text-white">Listed Products & Services</h2>
                  <button 
                    onClick={handleAddClick}
                    className="bg-[#049454] text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/10 transition-all hover:scale-[1.02]"
                  >
                    {showForm ? 'Cancel' : '+ Add New Item'}
                  </button>
                </div>

                {showForm && (
                  <form onSubmit={handleProductSubmit} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-emerald-500/20 shadow-xl animate-in slide-in-from-top-4 duration-300">
                    <h3 className="font-bold dark:text-white mb-6">{showForm === 'add' ? 'New Item Details' : 'Edit Item Details'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
                        <input 
                          required 
                          type="text" 
                          value={productFormData.name}
                          onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                          placeholder="e.g. Spiral Notebook / Extra Large Pizza" 
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                        <input 
                          required 
                          type="number" 
                          value={productFormData.price}
                          onChange={(e) => setProductFormData({...productFormData, price: e.target.value})}
                          placeholder="e.g. 450" 
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Item Image URL</label>
                      <input 
                        required 
                        type="url" 
                        value={productFormData.image}
                        onChange={(e) => setProductFormData({...productFormData, image: e.target.value})}
                        placeholder="Paste an image URL here..." 
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" 
                      />
                    </div>
                    <div className="space-y-2 mb-6">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea 
                        required 
                        rows={3}
                        value={productFormData.description}
                        onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                        placeholder="Details about your item..." 
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 resize-none"
                      />
                    </div>
                    <button type="submit" className="w-full bg-[#049454] text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/10">
                      {showForm === 'add' ? 'List Item' : 'Save Changes'}
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map(product => (
                    <div key={product.id} className="bg-white dark:bg-slate-900 rounded-[28px] p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex gap-5">
                      <img src={product.image} className="w-24 h-24 rounded-2xl object-cover shrink-0" alt={product.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold dark:text-white text-sm truncate pr-2">{product.name}</h4>
                          <div className="flex gap-3 shrink-0">
                            <button 
                              onClick={() => handleEditClick(product)} 
                              className="text-slate-400 hover:text-blue-500 transition-colors p-1"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                            </button>
                            <button 
                              onClick={() => onDeleteProduct(product.id)} 
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-[#049454] font-extrabold text-base mb-1">₹{product.price}</p>
                        <p className="text-[10px] text-slate-500 font-medium line-clamp-2 leading-relaxed">{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'orders' && (activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-xl font-bold dark:text-white">Active Customer Orders</h2>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{orders.length} Pending</p>
                </div>
                {orders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order #{order.id}</p>
                        <p className="font-bold dark:text-white">{order.date}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${order.status === 'Processing' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-500' : 'bg-emerald-50 dark:bg-emerald-950/30 text-[#049454]'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-3 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name} x{item.quantity}</span>
                          <span className="font-bold dark:text-white">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    {order.instructions && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800 mb-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Customer Instructions</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{order.instructions}"</p>
                      </div>
                    )}
                    {order.status === 'Processing' && (
                      <div className="space-y-4 mb-6 pt-6 border-t dark:border-slate-800">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Add Note to Customer</label>
                        <textarea 
                          value={orderNotes[order.id] || ''}
                          onChange={(e) => setOrderNotes({...orderNotes, [order.id]: e.target.value})}
                          placeholder="e.g. Your items are being prepared!" 
                          rows={2}
                          className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 resize-none text-sm"
                        />
                        <button 
                          onClick={() => onProcessOrder(order.id, orderNotes[order.id] || '')}
                          className="bg-[#049454] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/10 hover:bg-[#037c46] transition-all"
                        >
                          Process & Send Message
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <form onSubmit={handleStoreSubmit} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 space-y-8">
                  <h2 className="text-xl font-bold dark:text-white mb-6">Update Store Profile</h2>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Store Name</label>
                    <input 
                      required 
                      type="text" 
                      value={storeFormData.name}
                      onChange={(e) => setStoreFormData({...storeFormData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service Category (e.g. Stationery, Plastic Shop, PG, Hostel, Pizza)</label>
                    <input 
                      required 
                      type="text" 
                      value={storeFormData.category}
                      onChange={(e) => setStoreFormData({...storeFormData, category: e.target.value})}
                      placeholder="Enter your service type..." 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" 
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Sellers can list any local service. You are not limited to presets.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Store Photo URL</label>
                    <input 
                      required 
                      type="url" 
                      value={storeFormData.image}
                      onChange={(e) => setStoreFormData({...storeFormData, image: e.target.value})}
                      placeholder="URL for your store's banner image..." 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Store Description</label>
                    <textarea 
                      required 
                      rows={4}
                      value={storeFormData.description}
                      onChange={(e) => setStoreFormData({...storeFormData, description: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-[#049454]/20 resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full bg-[#049454] text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/10 hover:bg-[#037c46] transition-all">
                    Update Store Settings
                  </button>
                </form>

                <div className="bg-rose-50 dark:bg-rose-950/20 rounded-[32px] p-8 border border-rose-100 dark:border-rose-900/30">
                  <h3 className="text-rose-500 font-bold mb-2">Danger Zone</h3>
                  <p className="text-xs text-rose-400 mb-6">Deleting your store will remove all your products and history from the platform. This action is irreversible.</p>
                  <button 
                    onClick={handleDeleteStoreClick}
                    className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-rose-900/20 hover:bg-rose-600 transition-all"
                  >
                    Delete My Store Permanently
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;