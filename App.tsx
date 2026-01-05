
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StoreCard from './components/StoreCard';
import StoreDetail from './components/StoreDetail';
import ProductDetail from './components/ProductDetail';
import CheckoutPage from './components/CheckoutPage';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import OrdersPage from './components/OrdersPage';
import SellerDashboardPage from './components/SellerDashboardPage';
import SellerVerificationPage from './components/SellerVerificationPage';
import { Store, Product, CartItem, Order, UserProfile } from './types';

const INITIAL_STORES: Store[] = [
  { id: '1', name: 'The Village Bakery', category: 'Bakery', rating: 4.9, deliveryTime: '20-30 min', deliveryFee: 49, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800', description: 'Artisanal breads and morning pastries baked daily with organic flour.' },
  { id: '2', name: 'Green Leaf Grocer', category: 'Grocery', rating: 4.7, deliveryTime: '30-45 min', deliveryFee: 79, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', description: 'The freshest seasonal produce from local community farms.' },
  { id: '3', name: 'Bansal Stationaries', category: 'Stationary', rating: 4.5, deliveryTime: '15-20 min', deliveryFee: 20, image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=800', description: 'All your academic essentials, from notebooks to high-quality pens.' },
  { id: '4', name: 'Radhe Shyam PG', category: 'Hostel/PG', rating: 4.8, deliveryTime: 'Immediate', deliveryFee: 0, image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800', description: 'Premium student accommodation with modern amenities and meal services.' },
  { id: '5', name: 'The Pizza Corner', category: 'Pizza Corner', rating: 4.6, deliveryTime: '35-45 min', deliveryFee: 40, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', description: 'Authentic wood-fired pizzas with a variety of local toppings.' },
  { id: '6', name: 'Agarwal Plastic Shop', category: 'Plastic Shop', rating: 4.4, deliveryTime: '20-30 min', deliveryFee: 30, image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=800', description: 'Quality household plasticware, containers, and kitchen essentials.' },
];

const INITIAL_PRODUCTS: Record<string, Product[]> = {
  '1': [
    { id: 'p1', storeId: '1', name: 'Sourdough Loaf', price: 250, image: 'https://images.unsplash.com/photo-1585478259715-876a6a81fc08?auto=format&fit=crop&w=400', description: '24-hour fermented classic sourdough.', rating: 4.8, reviewCount: 124 },
    { id: 'p2', storeId: '1', name: 'Almond Croissant', price: 180, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400', description: 'Double-baked with house-made frangipane.', rating: 4.9, reviewCount: 86 },
  ],
  '2': [
    { id: 'p4', storeId: '2', name: 'Organic Avocado', price: 120, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400', description: 'Perfectly ripe Hass avocado.', rating: 4.9, reviewCount: 210 },
  ],
  '3': [
    { id: 'p5', storeId: '3', name: 'Luxury Journal', price: 599, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=400', description: 'Leather-bound journal with 120gsm paper.', rating: 4.7, reviewCount: 45 },
  ],
};

const HERO_SLIDES = [
  { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200', category: 'Grocery' },
  { image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200', category: 'Pizza Corner' },
  { image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=1200', category: 'Stationary' },
  { image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200', category: 'Hostel/PG' },
];

const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.j@locality.com',
  phone: '+91 98765 43210',
  address: '12-A, Silicon Tower, Indiranagar, Bengaluru',
  joinDate: 'March 2024'
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'auth' | 'profile' | 'orders' | 'store-detail' | 'product-detail' | 'checkout' | 'seller-dashboard' | 'seller-verification'>('home');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [allProducts, setAllProducts] = useState<Record<string, Product[]>>(INITIAL_PRODUCTS);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    if (view === 'home') {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [view]);

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          store.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? store.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [stores, searchQuery, categoryFilter]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleOrderSuccess = (instructions?: string) => {
    const newOrder: Order = {
      id: `LOC-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      total: cart.reduce((s, i) => s + (i.price * i.quantity), 0) + 79,
      status: 'Processing',
      instructions
    };
    setOrderHistory(prev => [newOrder, ...prev]);
    setCart([]);
    setView('orders');
  };

  const handleAddProduct = (storeId: string, product: Product) => {
    setAllProducts(prev => ({
      ...prev,
      [storeId]: [...(prev[storeId] || []), product]
    }));
  };

  const handleUpdateProduct = (storeId: string, updatedProduct: Product) => {
    setAllProducts(prev => ({
      ...prev,
      [storeId]: prev[storeId].map(p => p.id === updatedProduct.id ? updatedProduct : p)
    }));
  };

  const handleDeleteProduct = (storeId: string, productId: string) => {
    setAllProducts(prev => ({
      ...prev,
      [storeId]: prev[storeId].filter(p => p.id !== productId)
    }));
  };

  const handleUpdateStore = (updatedStore: Store) => {
    setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
  };

  const handleDeleteStore = (storeId: string) => {
    setStores(prev => prev.filter(s => s.id !== storeId));
    setIsSeller(false);
    setView('home');
  };

  const handleProcessOrder = (orderId: string, note: string) => {
    setOrderHistory(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Out for Delivery', sellerNote: note } : o));
  };

  const handleAuthSuccess = (email: string, seller: boolean, isSignUp: boolean) => {
    if (seller && isSignUp) {
      setView('seller-verification');
    } else {
      setIsLoggedIn(true);
      setIsSeller(seller);
      setUserProfile(prev => ({ ...prev, email }));
      setView('home');
    }
  };

  const handleVerificationComplete = (storeDetails?: Partial<Store>) => {
    if (storeDetails) {
        const newStore: Store = {
            id: `s-${Date.now()}`,
            name: storeDetails.name || 'New Local Business',
            category: storeDetails.category || 'Local Service',
            image: storeDetails.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
            description: storeDetails.description || 'Verified local merchant on Locality Delivers.',
            rating: 5.0,
            deliveryTime: '25-35 min',
            deliveryFee: 40
        };
        setStores(prev => [newStore, ...prev]);
    }
    setIsLoggedIn(true);
    setIsSeller(true);
    setView('seller-dashboard');
  };

  const handleHeroClick = (category: string) => {
    setCategoryFilter(category === categoryFilter ? null : category);
    setSearchQuery('');
    window.scrollTo({ top: document.querySelector('main')?.offsetTop ? document.querySelector('main')!.offsetTop - 100 : 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300`}>
      {['home', 'store-detail', 'product-detail'].includes(view) && (
        <Navbar 
          onCartClick={() => setIsCartOpen(true)} 
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
          onSearch={(query) => { setSearchQuery(query); setCategoryFilter(null); }}
          user={isLoggedIn ? { ...userProfile, isSeller } : null}
          onSignOut={() => { setIsLoggedIn(false); setIsSeller(false); setView('home'); }}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          language={language}
          setLanguage={setLanguage}
          onOpenModal={(m) => setView(m as any)}
        />
      )}

      {view === 'auth' && (
        <AuthPage 
          onBack={() => setView('home')} 
          onLogin={(email, seller, isSignUp) => handleAuthSuccess(email, seller, isSignUp)} 
        />
      )}
      
      {view === 'seller-verification' && (
        <SellerVerificationPage 
          onBack={() => setView('auth')}
          onComplete={handleVerificationComplete}
        />
      )}
      
      {view === 'profile' && <ProfilePage profile={userProfile} onBack={() => setView('home')} onUpdate={setUserProfile} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} language={language} onLanguageChange={setLanguage} />}
      
      {view === 'orders' && <OrdersPage orders={orderHistory} onBack={() => setView('home')} onCancelOrder={(id) => setOrderHistory(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o))} />}

      {view === 'seller-dashboard' && (
        <SellerDashboardPage 
          store={stores.find(s => s.id === '1') || stores[0]} 
          products={allProducts['1'] || []}
          orders={orderHistory.filter(o => o.items.some(item => item.storeId === '1'))}
          onBack={() => setView('home')}
          onUpdateStore={handleUpdateStore}
          onDeleteStore={handleDeleteStore}
          onAddProduct={(p) => handleAddProduct('1', p)}
          onUpdateProduct={(p) => handleUpdateProduct('1', p)}
          onDeleteProduct={(id) => handleDeleteProduct('1', id)}
          onProcessOrder={handleProcessOrder}
        />
      )}

      {view === 'home' && (
        <>
          <header className="pt-32 pb-20 px-6 border-b border-slate-50 dark:border-slate-900 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
              <div className="flex-1 space-y-6">
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Your neighborhood, <br/><span className="text-[#049454]">delivered.</span></h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl font-medium">Support local businesses, from bakeries to stationery shops and more.</p>
              </div>
              <div className="flex-1 w-full h-[400px] bg-slate-100 dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl relative">
                <div 
                  className="flex transition-transform duration-1000 ease-in-out h-full"
                  style={{ transform: `translateX(-${heroIndex * 100}%)` }}
                >
                  {HERO_SLIDES.map((slide, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 cursor-pointer relative group" onClick={() => handleHeroClick(slide.category)}>
                      <img 
                        src={slide.image} 
                        alt={`Slide ${idx}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                         <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl font-bold text-sm text-[#049454] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                           View {slide.category}s
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {HERO_SLIDES.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${heroIndex === idx ? 'w-6 bg-[#049454]' : 'w-1.5 bg-white/40'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
              <h3 className="text-2xl font-extrabold tracking-tight">
                {categoryFilter ? `Neighborhood ${categoryFilter}s` : searchQuery ? `Search Results for "${searchQuery}"` : 'Neighborhood Favorites'}
              </h3>
              {(categoryFilter || searchQuery) && (
                <button 
                  onClick={() => { setCategoryFilter(null); setSearchQuery(''); }}
                  className="text-sm font-bold text-[#049454] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
            
            {filteredStores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredStores.map(store => <StoreCard key={store.id} store={store} onClick={() => { setSelectedStore(store); setView('store-detail'); }} />)}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 font-bold">No stores found matching your criteria. Try searching for something else!</p>
              </div>
            )}
          </main>
        </>
      )}

      {view === 'store-detail' && selectedStore && <StoreDetail store={selectedStore} products={allProducts[selectedStore.id] || []} onBack={() => setView('home')} onProductClick={(p) => { setSelectedProduct(p); setView('product-detail'); }} onAddToCart={addToCart} />}

      {view === 'product-detail' && selectedProduct && <ProductDetail product={selectedProduct} similarProducts={[]} onBack={() => setView('store-detail')} onAddToCart={addToCart} onBuyNow={(p) => { addToCart(p); setView('checkout'); }} onStoreClick={() => {}} onProductClick={(p) => setSelectedProduct(p)} />}

      {view === 'checkout' && <CheckoutPage cart={cart} onBack={() => setView('home')} onSuccess={handleOrderSuccess} />}

      {isCartOpen && (
        <div className="fixed inset-0 z-[140]">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
             <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center"><h2 className="text-xl font-bold dark:text-white">Shopping Cart</h2><button onClick={() => setIsCartOpen(false)} className="text-slate-400">Close</button></div>
             <div className="flex-1 p-8 overflow-y-auto">{cart.map(i => <div key={i.id} className="flex justify-between items-center mb-4"><div className="flex flex-col"><span className="dark:text-white font-bold">{i.name}</span><span className="text-xs text-slate-400">Qty: {i.quantity}</span></div><span className="text-[#049454] font-bold">₹{i.price * i.quantity}</span></div>)}</div>
             {cart.length > 0 && <div className="p-8 border-t dark:border-slate-800"><div className="flex justify-between mb-4 font-bold dark:text-white"><span>Total</span><span>₹{cart.reduce((s, i) => s + (i.price * i.quantity), 0)}</span></div><button onClick={() => { setView('checkout'); setIsCartOpen(false); }} className="w-full bg-[#049454] text-white py-4 rounded-2xl font-bold">Proceed to Checkout</button></div>}
          </div>
        </div>
      )}

      <footer className="bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-800 py-16 text-center text-slate-400">
        <p className="text-xs font-bold uppercase tracking-[0.2em]">© 2024 Locality Network. Supporting Local Merchants.</p>
      </footer>
    </div>
  );
};

export default App;
