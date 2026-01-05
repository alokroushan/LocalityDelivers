
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
import AdminDashboardPage from './components/AdminDashboardPage';
import { Store, Product, CartItem, Order, UserProfile, HeroSlide } from './types';

const INITIAL_STORES: Store[] = [
  { id: '1', name: 'The Village Bakery', category: 'Bakery', rating: 4.9, deliveryTime: '20-30 min', deliveryFee: 49, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800', description: 'Artisanal breads and morning pastries baked daily with organic flour.' },
  { id: '2', name: 'Green Leaf Grocer', category: 'Grocery', rating: 4.7, deliveryTime: '30-45 min', deliveryFee: 79, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', description: 'The freshest seasonal produce from local community farms.' },
  { id: '3', name: 'Bansal Stationaries', category: 'Stationary', rating: 4.5, deliveryTime: '15-20 min', deliveryFee: 20, image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=800', description: 'All your academic essentials, from notebooks to high-quality pens.' },
  { id: '4', name: 'Radhe Shyam PG', category: 'Hostel/PG', rating: 4.8, deliveryTime: 'Immediate', deliveryFee: 0, image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=800', description: 'Premium student accommodation with modern amenities and meal services.' },
  { id: '5', name: 'The Pizza Corner', category: 'Pizza Corner', rating: 4.6, deliveryTime: '35-45 min', deliveryFee: 40, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200', description: 'Authentic wood-fired pizzas with a variety of local toppings.' },
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

const INITIAL_HERO_SLIDES: HeroSlide[] = [
  { image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200', category: 'Hostel/PG', color: 'bg-amber-100/40 dark:bg-amber-950/20' },
  { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200', category: 'Grocery', color: 'bg-emerald-100/40 dark:bg-emerald-950/20' },
  { image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200', category: 'Pizza Corner', color: 'bg-orange-100/40 dark:bg-orange-950/20' },
  { image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=1200', category: 'Stationary', color: 'bg-sky-100/40 dark:bg-sky-950/20' },
];

const CATEGORIES = [
  { name: 'Grocery', icon: '🥕', hasDropdown: false },
  { name: 'Bakery', icon: '🥐', hasDropdown: true },
  { name: 'Pizza Corner', icon: '🍕', hasDropdown: false },
  { name: 'Stationary', icon: '📚', hasDropdown: true },
  { name: 'Hostel/PG', icon: '🏠', hasDropdown: true },
  { name: 'Plastic Shop', icon: '📦', hasDropdown: true },
  { name: 'Home Services', icon: '🛠️', hasDropdown: false },
  { name: 'Nearby Shops', icon: '📍', hasDropdown: false },
];

const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.j@locality.com',
  phone: '+91 98765 43210',
  address: '12-A, Silicon Tower, Indiranagar, Bengaluru',
  joinDate: 'March 2024'
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'auth' | 'profile' | 'orders' | 'store-detail' | 'product-detail' | 'checkout' | 'seller-dashboard' | 'seller-verification' | 'admin-dashboard'>('home');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [allProducts, setAllProducts] = useState<Record<string, Product[]>>(INITIAL_PRODUCTS);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(INITIAL_HERO_SLIDES);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sellerStoreId, setSellerStoreId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const [registeredUsers, setRegisteredUsers] = useState<{email: string, isSeller: boolean, isAdmin?: boolean}[]>([
    { email: 'alex.j@locality.com', isSeller: false },
    { email: 'seller@locality.com', isSeller: true },
    { email: 'loca@gmail.com', isSeller: false, isAdmin: true }
  ]);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    if (view === 'home') {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [view, heroSlides.length]);

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      // Admin sees everything, others only public
      if (!isAdmin && store.isPrivate) return false;

      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          store.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = (categoryFilter && categoryFilter !== 'Nearby Shops') ? store.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [stores, searchQuery, categoryFilter, isAdmin]);

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
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 79,
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
      [storeId]: (prev[storeId] || []).map(p => p.id === updatedProduct.id ? updatedProduct : p)
    }));
  };

  const handleDeleteProduct = (storeId: string, productId: string) => {
    setAllProducts(prev => ({
      ...prev,
      [storeId]: (prev[storeId] || []).filter(p => p.id !== productId)
    }));
  };

  const handleUpdateStore = (updatedStore: Store) => {
    setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
  };

  const handleDeleteStore = (storeId: string) => {
    setStores(prev => prev.filter(s => s.id !== storeId));
    if (sellerStoreId === storeId) {
      setIsSeller(false);
      setSellerStoreId(null);
    }
    if (view === 'seller-dashboard') setView('home');
  };

  const handleProcessOrder = (orderId: string, note: string) => {
    setOrderHistory(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Out for Delivery', sellerNote: note } : o));
  };

  const handleAuthSuccess = (email: string, seller: boolean, isSignUp: boolean) => {
    const existingUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Special Admin Check
    if (email.toLowerCase() === 'loca@gmail.com') {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setIsSeller(false);
      setUserProfile({ ...INITIAL_PROFILE, name: 'System Admin', email: 'loca@gmail.com' });
      setView('admin-dashboard');
      return;
    }

    if (isSignUp) {
      if (existingUser) {
        setAuthError("An account with this email already exists. Please sign in.");
        return;
      }
      setRegisteredUsers(prev => [...prev, { email, isSeller: seller }]);
    } else {
      if (!existingUser) {
        setAuthError("No account found with this email. Please sign up instead.");
        return;
      }
      if (existingUser.isSeller !== seller) {
        setAuthError(`This account is registered as a ${existingUser.isSeller ? 'Seller' : 'Customer'}. Please switch roles above.`);
        return;
      }
    }

    setAuthError(null);
    if (seller && isSignUp) {
      setView('seller-verification');
    } else {
      setIsLoggedIn(true);
      setIsSeller(seller);
      setIsAdmin(false);
      if (seller) {
        if (email === 'seller@locality.com') setSellerStoreId('1');
        else setSellerStoreId(null);
      }
      if (email === INITIAL_PROFILE.email) {
        setUserProfile(INITIAL_PROFILE);
      } else {
        setUserProfile(prev => ({ ...prev, email, name: email.split('@')[0] }));
      }
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
        setSellerStoreId(newStore.id);
    }
    setIsLoggedIn(true);
    setIsSeller(true);
    setView('seller-dashboard');
  };

  const scrollToMain = () => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      window.scrollTo({ top: mainElement.offsetTop - 100, behavior: 'smooth' });
    }
  };

  const handleHeroClick = (category: string) => {
    setCategoryFilter(category === categoryFilter ? null : category);
    setSearchQuery('');
    scrollToMain();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300`}>
      {['home', 'store-detail', 'product-detail'].includes(view) && (
        <Navbar 
          onCartClick={() => setIsCartOpen(true)} 
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
          onSearch={(query) => { 
            setSearchQuery(query); 
            setCategoryFilter(null); 
            scrollToMain();
          }}
          onSignInClick={() => { setAuthError(null); setView('auth'); }}
          user={isLoggedIn ? { ...userProfile, isSeller, isAdmin } : null}
          onSignOut={() => { setIsLoggedIn(false); setIsSeller(false); setIsAdmin(false); setSellerStoreId(null); setView('home'); }}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          language={language}
          setLanguage={setLanguage}
          onOpenModal={(m) => setView(m as any)}
        />
      )}

      {view === 'auth' && (
        <AuthPage 
          onBack={() => { setAuthError(null); setView('home'); }} 
          onLogin={(email, seller, isSignUp) => handleAuthSuccess(email, seller, isSignUp)} 
          error={authError}
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
          store={stores.find(s => s.id === sellerStoreId) || stores[0]} 
          products={allProducts[sellerStoreId || ''] || []}
          orders={orderHistory.filter(o => o.items.some(item => item.storeId === sellerStoreId))}
          onBack={() => setView('home')}
          onUpdateStore={handleUpdateStore}
          onDeleteStore={handleDeleteStore}
          onAddProduct={(p) => handleAddProduct(sellerStoreId || '', p)}
          onUpdateProduct={(p) => handleUpdateProduct(sellerStoreId || '', p)}
          onDeleteProduct={(id) => handleDeleteProduct(sellerStoreId || '', id)}
          onProcessOrder={handleProcessOrder}
        />
      )}

      {view === 'admin-dashboard' && (
        <AdminDashboardPage 
          stores={stores}
          products={allProducts}
          heroSlides={heroSlides}
          onBack={() => setView('home')}
          onUpdateHeroSlides={setHeroSlides}
          onUpdateStore={handleUpdateStore}
          onDeleteStore={handleDeleteStore}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {view === 'home' && (
        <>
          <div className="h-20" />
          <div className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 transition-colors overflow-x-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8 py-3 min-w-max">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleHeroClick(cat.name)}
                  className={`flex flex-col items-center gap-1.5 group transition-all transform hover:scale-105 ${categoryFilter === cat.name ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl bg-slate-50 dark:bg-slate-900 border ${categoryFilter === cat.name ? 'border-[#049454] bg-[#049454]/5' : 'border-slate-100 dark:border-slate-800'}`}>
                    {cat.icon}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-bold whitespace-nowrap tracking-tight ${categoryFilter === cat.name ? 'text-[#049454]' : 'text-slate-600 dark:text-slate-300'}`}>
                      {cat.name}
                    </span>
                    {cat.hasDropdown && (
                      <svg className="w-2 h-2 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <header 
            className="relative h-[200px] overflow-hidden flex items-center shadow-sm w-full cursor-pointer group"
            onClick={() => handleHeroClick(heroSlides[heroIndex].category)}
          >
            <div className="absolute top-0 bottom-0 left-0 right-0 z-0 pointer-events-none overflow-hidden">
              <div 
                className="flex transition-transform duration-1000 ease-in-out h-full"
                style={{ transform: `translateX(-${heroIndex * 100}%)` }}
              >
                {heroSlides.map((slide, idx) => (
                  <div key={idx} className={`w-full h-full flex-shrink-0 relative ${slide.color}`}>
                    <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-inherit to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute inset-0 z-[1] overflow-hidden">
              <div 
                className="flex transition-transform duration-1000 ease-in-out h-full"
                style={{ transform: `translateX(-${heroIndex * 100}%)` }}
              >
                {heroSlides.map((slide, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 relative">
                    <img 
                      src={slide.image} 
                      alt={`Slide ${idx}`} 
                      className="w-full h-full object-cover brightness-[0.9] dark:brightness-[0.4]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/50 to-transparent dark:from-slate-950/95 dark:via-slate-950/50 dark:to-transparent"></div>
                    <div className="absolute top-3 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-xl text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] opacity-80">
                      LIVE DEALS: {slide.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-7xl mx-auto w-full relative z-[10] px-8">
              <div className="max-w-xl space-y-2 animate-in slide-in-from-left-8 duration-700">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Local favorites, <span className="text-[#049454] drop-shadow-sm">delivered fast.</span>
                </h2>
                <p className="hidden md:block text-sm text-slate-600 dark:text-slate-300 max-w-sm font-medium leading-relaxed">
                  Support your neighbors. Quality items nearby, delivered in minutes.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); scrollToMain(); }}
                    className="bg-[#049454] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/10 hover:bg-[#037c46] transition-all transform hover:scale-[1.02]"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-8 flex gap-2 z-20">
              {heroSlides.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={(e) => { e.stopPropagation(); setHeroIndex(idx); }}
                  className={`h-1 rounded-full transition-all duration-300 ${heroIndex === idx ? 'w-8 bg-[#049454]' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
                />
              ))}
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-4 gap-4 border-b border-slate-50 dark:border-slate-900 pb-2">
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold tracking-tight">
                  {categoryFilter ? (categoryFilter === 'Nearby Shops' ? 'Neighborhood Pulse' : `${categoryFilter} Gems`) : searchQuery ? `Search Results for "${searchQuery}"` : 'Best deals in your neighborhood'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Verified local merchants delivering now.</p>
              </div>
              {(categoryFilter || searchQuery) && (
                <button 
                  onClick={() => { setCategoryFilter(null); setSearchQuery(''); }}
                  className="text-sm font-bold text-[#049454] hover:underline flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
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
             <div className="flex-1 p-8 overflow-y-auto">{cart.map(item => <div key={item.id} className="flex justify-between items-center mb-4"><div className="flex flex-col"><span className="dark:text-white font-bold">{item.name}</span><span className="text-xs text-slate-400">Qty: {item.quantity}</span></div><span className="text-[#049454] font-bold">₹{item.price * item.quantity}</span></div>)}</div>
             {cart.length > 0 && <div className="p-8 border-t dark:border-slate-800"><div className="flex justify-between mb-4 font-bold dark:text-white"><span>Total</span><span>₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span></div><button onClick={() => { setView('checkout'); setIsCartOpen(false); }} className="w-full bg-[#049454] text-white py-4 rounded-2xl font-bold">Proceed to Checkout</button></div>}
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
