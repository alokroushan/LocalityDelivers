import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, collection, query, deleteDoc, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from './firebase';
import Navbar from './components/Navbar';
import StoreCard from './components/StoreCard';
import StoreDetail from './components/StoreDetail';
import ProductDetail from './components/ProductDetail';
import CheckoutPage from './components/CheckoutPage';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import OrdersPage from './components/OrdersPage';
import OrderTracking from './components/OrderTracking';
import SellerDashboardPage from './components/SellerDashboardPage';
import SellerVerificationPage from './components/SellerVerificationPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import { Store, Product, CartItem, Order, UserProfile, AppSettings, CategoryItem, HeroSlide, MerchantOnboardingRequest } from './types';
import { getLocalRecommendations } from './services/geminiService';

const INITIAL_APP_SETTINGS: AppSettings = {
  navTitle: 'Locality',
  navSubtitle: 'Neighborhood Pulse',
  navIconUrl: '', 
  heroHeading: 'Local favorites,',
  heroHeadingHighlight: 'delivered fast.',
  heroSubtext: 'Support your neighbors. Quality items nearby, delivered in minutes.',
  dealsHeading: 'Best deals in your neighborhood',
  dealsSubtext: 'Verified local merchants delivering now.',
  footerText: '© 2024 LOCALITY NETWORK. SUPPORTING LOCAL MERCHANTS.'
};

const INITIAL_CATEGORIES: CategoryItem[] = [
  { name: 'Grocery', icon: '🥕', hasDropdown: false },
  { name: 'Bakery', icon: '🥐', hasDropdown: true },
  { name: 'Pizza Corner', icon: '🍕', hasDropdown: false },
  { name: 'Stationary', icon: '📚', hasDropdown: true },
  { name: 'Hostel/PG', icon: '🏠', hasDropdown: true },
  { name: 'Plastic Shop', icon: '📦', hasDropdown: true },
  { name: 'Home Services', icon: '🛠️', hasDropdown: false },
  { name: 'Nearby Shops', icon: '📍', hasDropdown: false },
];

const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600',
    category: 'Grocery',
    color: 'bg-emerald-100/40 dark:bg-emerald-950/20'
  },
  {
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1600',
    category: 'Bakery',
    color: 'bg-amber-100/40 dark:bg-amber-950/20'
  },
  {
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=1600',
    category: 'Stationary',
    color: 'bg-sky-100/40 dark:bg-sky-950/20'
  },
  {
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1600',
    category: 'Pizza Corner',
    color: 'bg-orange-100/40 dark:bg-orange-950/20'
  }
];

const INITIAL_STORES: Store[] = [
  { id: 's1', name: 'The Village Bakery', category: 'Bakery', rating: 4.9, deliveryTime: '20-30 min', deliveryFee: 40, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800', description: 'Artisanal breads and morning pastries baked daily with organic flour.', isVerified: true },
  { id: 's2', name: 'Green Leaf Grocer', category: 'Grocery', rating: 4.7, deliveryTime: '30-45 min', deliveryFee: 30, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', description: 'The freshest seasonal produce from local community farms.', isVerified: true },
  { id: 's3', name: 'Bansal Stationaries', category: 'Stationary', rating: 4.5, deliveryTime: '15-20 min', deliveryFee: 20, image: 'https://images.unsplash.com/photo-1503551723145-6c040742065b?auto=format&fit=crop&q=80&w=800', description: 'All your academic essentials, from notebooks to high-quality pens.', isVerified: false },
  { id: 's4', name: 'Radhe Shyam PG', category: 'Hostel/PG', rating: 4.8, deliveryTime: 'IMMEDIATE', deliveryFee: 0, image: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&q=80&w=800', description: 'Premium student accommodation with modern amenities and meal services.', isVerified: false },
  { id: 's5', name: 'The Pizza Corner', category: 'Pizza Corner', rating: 4.6, deliveryTime: '35-45 min', deliveryFee: 50, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', description: 'Authentic wood-fired pizzas with a variety of local toppings.', isVerified: false },
  { id: 's6', name: 'Agarwal Plastic Shop', category: 'Plastic Shop', rating: 4.4, deliveryTime: '20-30 min', deliveryFee: 15, image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&q=80&w=800', description: 'Quality household plasticware, containers, and kitchen essentials.', isVerified: false },
  { id: 's7', name: 'Modern Medicals', category: 'Home Services', rating: 4.9, deliveryTime: '10-15 min', deliveryFee: 25, image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=800', description: 'Reliable neighborhood pharmacy with emergency home delivery services.', isVerified: true },
  { id: 's8', name: 'Pet Paradise', category: 'Nearby Shops', rating: 4.7, deliveryTime: '25-40 min', deliveryFee: 45, image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800', description: 'Everything your pets need, from premium nutrition to grooming supplies.', isVerified: true }
];

const INITIAL_PRODUCTS: Record<string, Product[]> = {
  's1': [
    { id: 'p1', storeId: 's1', name: 'Sourdough Loaf', price: 120, image: 'https://images.unsplash.com/photo-1585478259715-876a6a81b764?auto=format&fit=crop&q=80&w=400', description: 'Crusty outside, soft inside. Perfect for sandwiches.', rating: 4.8, reviewCount: 12 },
    { id: 'p2', storeId: 's1', name: 'Butter Croissant', price: 65, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400', description: 'Flaky, buttery layers made with French butter.', rating: 4.9, reviewCount: 25 }
  ],
  's2': [
    { id: 'p3', storeId: 's2', name: 'Organic Spinach', price: 40, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', description: 'Freshly picked farm spinach.', rating: 4.7, reviewCount: 45 }
  ]
};

const App: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [allProducts, setAllProducts] = useState<Record<string, Product[]>>({});
  const [appSettings, setAppSettings] = useState<AppSettings>(INITIAL_APP_SETTINGS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(INITIAL_HERO_SLIDES);
  const [allOrders, setAllOrders] = useState<(Order & { customerEmail: string })[]>([]);
  const [onboardingRequests, setOnboardingRequests] = useState<MerchantOnboardingRequest[]>([]);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sellerStoreId, setSellerStoreId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'Guest', email: '', phone: '', address: '', joinDate: '' });

  const [recoveryUser, setRecoveryUser] = useState<any>(null);

  const [view, setView] = useState<'home' | 'auth' | 'profile' | 'orders' | 'order-tracking' | 'store-detail' | 'product-detail' | 'checkout' | 'seller-dashboard' | 'seller-verification' | 'admin-dashboard'>('home');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [heroIndex, setHeroIndex] = useState(0);

  // Categorized Discovery State
  const [nearbyDiscovery, setNearbyDiscovery] = useState<{ text: string, categories: any[] } | null>(null);
  const [isNearbyLoading, setIsNearbyLoading] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setRecoveryUser(null);
        const isLocaAdmin = user.email?.toLowerCase() === 'loca@gmail.com';
        
        // Immediate Admin Recovery: Set identity before Firestore document loads
        if (isLocaAdmin) {
          setIsAdmin(true);
          setUserProfile({
            name: 'System Admin',
            email: user.email || 'loca@gmail.com',
            phone: '',
            address: 'Central Headquarters',
            joinDate: 'Genesis'
          });
        }

        onSnapshot(doc(db, 'users', user.uid), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setUserProfile({
              name: data.name || (isLocaAdmin ? 'System Admin' : user.displayName) || 'Neighbor',
              email: user.email || '',
              phone: data.phone || '',
              address: data.address || '',
              joinDate: data.joinDate || '2024'
            });
            setIsSeller(data.isSeller || false);
            setIsAdmin(data.isAdmin || isLocaAdmin);
            setSellerStoreId(data.storeId || null);
          } else if (isLocaAdmin) {
            // Keep Admin identity stable even if doc doesn't exist
            setUserProfile(prev => ({ ...prev, name: 'System Admin', isAdmin: true }));
          }
        });
      } else {
        if (!recoveryUser) {
            setIsLoggedIn(false);
            setUserProfile({ name: 'Guest', email: '', phone: '', address: '', joinDate: '' });
            setIsSeller(false);
            setIsAdmin(false);
            setSellerStoreId(null);
        }
      }
      setLoading(false);
    });

    const unsubStores = onSnapshot(collection(db, 'stores'), (snap) => {
      const dbStores = snap.docs.map(d => ({ id: d.id, ...d.data() } as Store & { isDeleted?: boolean }));
      const storeMap = new Map<string, Store & { isDeleted?: boolean }>();
      INITIAL_STORES.forEach(s => storeMap.set(s.id, s));
      dbStores.forEach(s => {
        const existing = storeMap.get(s.id);
        storeMap.set(s.id, { ...(existing || {}), ...s });
      });
      setStores(Array.from(storeMap.values()).filter(s => !s.isDeleted));
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      const dbProducts = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product & { isDeleted?: boolean }));
      const map: Record<string, Product[]> = {};
      Object.keys(INITIAL_PRODUCTS).forEach(sid => { map[sid] = [...INITIAL_PRODUCTS[sid]]; });
      dbProducts.forEach(p => {
        if (!map[p.storeId]) map[p.storeId] = [];
        const existingIdx = map[p.storeId].findIndex(item => item.id === p.id);
        if (p.isDeleted) { if (existingIdx > -1) map[p.storeId].splice(existingIdx, 1); } 
        else {
           if (existingIdx > -1) map[p.storeId][existingIdx] = { ...map[p.storeId][existingIdx], ...p };
           else map[p.storeId].push(p);
        }
      });
      setAllProducts(map);
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      setAllOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    });

    const unsubOnboarding = onSnapshot(collection(db, 'merchant_requests'), (snap) => {
      setOnboardingRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as MerchantOnboardingRequest)));
    });

    const unsubSettings = onSnapshot(doc(db, 'config', 'app_settings'), (snap) => {
      if (snap.exists()) setAppSettings(snap.data() as AppSettings);
    });

    const unsubCats = onSnapshot(doc(db, 'config', 'categories'), (snap) => {
      if (snap.exists()) setCategories(snap.data().list || INITIAL_CATEGORIES);
    });

    const unsubHero = onSnapshot(doc(db, 'config', 'hero_slides'), (snap) => {
      if (snap.exists()) setHeroSlides(snap.data().list || INITIAL_HERO_SLIDES);
    });

    return () => { unsubAuth(); unsubStores(); unsubProducts(); unsubOrders(); unsubSettings(); unsubCats(); unsubHero(); unsubOnboarding(); };
  }, [recoveryUser]);

  // Handle "Nearby Shops" categorized real-time discovery
  useEffect(() => {
    if (categoryFilter === 'Nearby Shops') {
      handleFetchNearby();
    } else {
      setNearbyDiscovery(null);
    }
  }, [categoryFilter]);

  const handleFetchNearby = () => {
    setIsNearbyLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsNearbyLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const result = await getLocalRecommendations(latitude, longitude, "Best neighborhood stores and hidden gems");
      setNearbyDiscovery(result);
      setIsNearbyLoading(false);
    }, (err) => {
      console.error(err);
      setIsNearbyLoading(false);
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      if (store.isPrivate) return false;
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          store.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = (categoryFilter && categoryFilter !== 'Nearby Shops') ? store.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [stores, searchQuery, categoryFilter]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleHeroClick = () => {
    const currentSlide = heroSlides[heroIndex];
    if (currentSlide && currentSlide.category) {
      const matched = categories.find(c => c.name.toLowerCase() === currentSlide.category.toLowerCase());
      if (matched) setCategoryFilter(matched.name);
    }
    document.getElementById('stores-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShopNow = () => {
    setCategoryFilter(null);
    document.getElementById('stores-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderSuccess = async (instructions?: string) => {
    if (!isLoggedIn) { setView('auth'); return; }
    const orderId = `LOC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 79,
      status: 'Processing',
      instructions,
      customerEmail: userProfile.email
    };
    await setDoc(doc(db, 'orders', orderId), newOrder);
    setCart([]);
    setView('orders');
  };

  const handleLogin = (email: string, isSeller: boolean, isSignUp: boolean, recoveryData?: any) => {
    const targetEmail = email.toLowerCase().trim();
    if (targetEmail === 'loca@gmail.com' || recoveryData?.isAdmin) {
        setIsAdmin(true);
        setIsLoggedIn(true);
        setUserProfile({
            name: 'System Admin',
            email: targetEmail,
            phone: '',
            address: 'Headquarters',
            joinDate: 'Genesis'
        });
        setView('home');
        return;
    }

    if (recoveryData?.isRecovery) {
        setRecoveryUser(recoveryData);
        setIsLoggedIn(true);
        setIsSeller(true);
        setSellerStoreId(recoveryData.storeId);
        setUserProfile({
            name: recoveryData.storeName || 'Merchant',
            email: targetEmail,
            phone: '',
            address: '',
            joinDate: 'Recovered Access'
        });
        setView('home');
    } else {
        if (isSignUp && isSeller) setView('seller-verification');
        else setView('home');
    }
  };

  const handleApproveMerchant = async (reqId: string) => {
    const req = onboardingRequests.find(r => r.id === reqId);
    if (!req) return;
    
    const storeId = `s-${Date.now()}`;
    await setDoc(doc(db, 'stores', storeId), {
      id: storeId,
      name: req.businessName ?? 'Unnamed Local Merchant',
      category: req.category ?? 'Local Business',
      image: req.photoUrl ?? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
      description: (req as any).description ?? `A verified local merchant supporting the neighborhood.`,
      rating: 5.0,
      deliveryFee: 40,
      deliveryTime: '20-30 min',
      isVerified: true,
      email: req.email,
      ownerId: req.userId
    });

    await updateDoc(doc(db, 'users', (req as any).userId), {
      isSeller: true,
      storeId: storeId
    });

    await updateDoc(doc(db, 'merchant_requests', reqId), {
      status: 'approved'
    });
  };

  const handleRejectMerchant = async (reqId: string, feedback: string) => {
    await updateDoc(doc(db, 'merchant_requests', reqId), {
      status: 'rejected',
      adminFeedback: feedback
    });
  };

  const handleHoldMerchant = async (reqId: string, feedback: string) => {
    await updateDoc(doc(db, 'merchant_requests', reqId), {
      status: 'on_hold',
      adminFeedback: feedback
    });
  };

  const handleSendChatMessage = async (requestId: string, sender: 'admin' | 'seller', text: string) => {
    await updateDoc(doc(db, 'merchant_requests', requestId), {
      chatHistory: arrayUnion({
        sender,
        text,
        timestamp: new Date().toISOString()
      })
    });
  };

  const handleDeleteStore = async (id: string) => {
    try {
        await setDoc(doc(db, 'stores', id), { isDeleted: true }, { merge: true });
        setStores(prev => prev.filter(s => s.id !== id));
    } catch (err) {
        console.error("Delete Error:", err);
    }
  };

  const handleSignOut = () => {
    if (recoveryUser || isAdmin) {
        setRecoveryUser(null);
        setIsAdmin(false);
        setIsLoggedIn(false);
        setView('home');
    } else {
        signOut(auth).then(() => setView('home'));
    }
  };

  const userRequest = useMemo(() => {
    const uid = recoveryUser ? recoveryUser.ownerId : auth.currentUser?.uid;
    if (!uid) return null;
    return onboardingRequests.find(r => r.userId === uid);
  }, [onboardingRequests, auth.currentUser, recoveryUser]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950"><div className="w-12 h-12 border-4 border-[#049454] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-white dark:bg-slate-950 font-sans transition-colors duration-300`}>
      {['home', 'store-detail', 'product-detail'].includes(view) && (
        <>
          <Navbar 
            onCartClick={() => setIsCartOpen(true)} 
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
            onSearch={(q) => setSearchQuery(q)}
            onSignInClick={() => setView('auth')}
            user={isLoggedIn ? { ...userProfile, isSeller, isAdmin } : null}
            onSignOut={handleSignOut}
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            language="English"
            setLanguage={() => {}}
            onOpenModal={(m) => setView(m as any)}
            appSettings={appSettings}
          />
          <div className="h-20" />
          <div className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 overflow-x-auto custom-scrollbar sticky top-20 z-[110]">
            <div className="w-full px-6 md:px-12 lg:px-20 flex items-center justify-between gap-6 sm:gap-8 py-4 sm:py-6 min-w-max md:min-w-0">
              {categoryFilter && (
                <button 
                  onClick={() => setCategoryFilter(null)}
                  className="flex flex-col items-center gap-1.5 group transition-all transform hover:scale-105 shrink-0"
                >
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                  </div>
                  <span className="text-[10px] font-bold whitespace-nowrap tracking-tight text-rose-500">Clear</span>
                </button>
              )}
              {categories.map((cat) => (
                <button 
                  key={cat.name} 
                  onClick={() => setCategoryFilter(cat.name === categoryFilter ? null : cat.name)} 
                  className={`flex flex-col items-center gap-1.5 group transition-all transform hover:scale-105 shrink-0 ${categoryFilter === cat.name ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl bg-slate-50 dark:bg-slate-900 border ${categoryFilter === cat.name ? 'border-[#049454] bg-[#049454]/5' : 'border-slate-100 dark:border-slate-800'}`}>
                    {cat.icon}
                  </div>
                  <span className={`text-[10px] font-bold whitespace-nowrap tracking-tight ${categoryFilter === cat.name ? 'text-[#049454]' : 'text-slate-600 dark:text-slate-300'}`}>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {view === 'auth' && <AuthPage onBack={() => setView('home')} onLogin={handleLogin} />}
      {view === 'seller-verification' && <SellerVerificationPage onBack={() => setView('home')} onComplete={(details) => setDoc(doc(db, 'merchant_requests', `REQ-${Date.now()}`), { ...details, userId: auth.currentUser?.uid, email: auth.currentUser?.email, status: 'pending', submittedAt: new Date().toISOString() }).then(() => setView('home'))} />}
      {view === 'profile' && <ProfilePage profile={userProfile} onBack={() => setView('home')} onUpdate={(p) => isLoggedIn && !recoveryUser && setDoc(doc(db, 'users', auth.currentUser!.uid), p, {merge: true})} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} language="English" onLanguageChange={() => {}} />}
      {view === 'orders' && <OrdersPage orders={allOrders.filter(o => o.customerEmail === userProfile.email)} onBack={() => setView('home')} onCancelOrder={(id) => setDoc(doc(db, 'orders', id), { status: 'Cancelled' }, { merge: true })} onTrackOrder={(id) => { setTrackingOrderId(id); setView('order-tracking'); }} />}
      {view === 'order-tracking' && trackingOrderId && <OrderTracking order={allOrders.find(o => o.id === trackingOrderId)!} onBack={() => setView('orders')} />}
      {view === 'checkout' && <CheckoutPage cart={cart} onBack={() => setView('home')} onSuccess={handleOrderSuccess} />}
      
      {view === 'seller-dashboard' && (
        sellerStoreId ? (
          <SellerDashboardPage 
            store={stores.find(s => s.id === sellerStoreId) || INITIAL_STORES[0]} 
            products={allProducts[sellerStoreId] || []} 
            orders={allOrders.filter(o => o.items.some(item => item.storeId === sellerStoreId))}
            onBack={() => setView('home')} 
            onUpdateStore={(s) => setDoc(doc(db, 'stores', s.id), s, {merge: true})} 
            onDeleteStore={handleDeleteStore}
            onAddProduct={(p) => setDoc(doc(db, 'products', p.id), p)} 
            onUpdateProduct={(p) => setDoc(doc(db, 'products', p.id), p)} 
            onDeleteProduct={(id) => setDoc(doc(db, 'products', id), { isDeleted: true }, { merge: true })} 
            onProcessOrder={(id, note) => setDoc(doc(db, 'orders', id), { status: 'Out for Delivery', sellerNote: note }, { merge: true })} 
            onSendMessage={(msg) => userRequest && handleSendChatMessage(userRequest.id, 'seller', msg)}
            chatHistory={userRequest?.chatHistory || []}
          />
        ) : (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 overflow-y-auto shrink-0 text-center">
             <div className={`w-20 h-20 ${userRequest?.status === 'rejected' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-950/30 text-[#049454]'} rounded-full flex items-center justify-center mb-8 shrink-0 mx-auto`}>
                {userRequest?.status === 'rejected' ? (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                ) : (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                )}
             </div>
             <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 shrink-0">
              {userRequest?.status === 'on_hold' ? 'Action Required' : userRequest?.status === 'rejected' ? 'Application Rejected' : 'Verification Pending'}
             </h2>
             <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 font-medium shrink-0 mx-auto">
              {userRequest?.status === 'on_hold' ? 'Locality admins have requested more documents or information from you.' : userRequest?.status === 'rejected' ? 'Your store application was not approved at this time. You can re-apply with better details.' : "Locality admins are currently reviewing your documents. You'll get access to your dashboard once your store is approved."}
             </p>
             <button onClick={() => setView('home')} className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-10 py-4 rounded-2xl font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 mx-auto">Back to Shopping</button>
          </div>
        )
      )}

      {view === 'admin-dashboard' && (
        <AdminDashboardPage 
          stores={stores} 
          products={allProducts} 
          heroSlides={heroSlides} 
          onboardingRequests={onboardingRequests} 
          appSettings={appSettings} 
          categories={categories} 
          onBack={() => setView('home')} 
          onUpdateHeroSlides={(slides) => setDoc(doc(db, 'config', 'hero_slides'), { list: slides })} 
          onUpdateStore={(s) => setDoc(doc(db, 'stores', s.id), s, {merge: true})} 
          onDeleteStore={handleDeleteStore} 
          onUpdateProduct={(storeId, p) => setDoc(doc(db, 'products', p.id), p)} 
          onDeleteProduct={(storeId, id) => setDoc(doc(db, 'products', id), { isDeleted: true, storeId }, { merge: true })} 
          onApproveMerchant={handleApproveMerchant} 
          onRejectMerchant={handleRejectMerchant} 
          onHoldMerchant={handleHoldMerchant}
          onUpdateAppSettings={(s) => setDoc(doc(db, 'config', 'app_settings'), s)} 
          onUpdateCategories={(c) => setDoc(doc(db, 'config', 'categories'), { list: c })} 
          onSendChatMessage={(reqId, sender, text) => handleSendChatMessage(reqId, sender, text)}
        />
      )}

      {view === 'home' && (
        <>
          <header onClick={handleHeroClick} className="relative h-[200px] md:h-[250px] overflow-hidden flex items-center w-full group cursor-pointer shrink-0">
            <div className="absolute inset-0 z-0">
               {heroSlides.map((slide, i) => (
                 <img 
                    key={i}
                    src={slide.image} 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === heroIndex ? 'opacity-100 brightness-[0.95] dark:brightness-[0.4]' : 'opacity-0 brightness-[0.95] dark:brightness-[0.4]'}`} 
                    style={{ opacity: i === heroIndex ? 1 : 0 }}
                    alt={`Hero ${i}`} 
                 />
               ))}
               <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/40 to-transparent dark:from-slate-950/95 dark:via-slate-950/40 dark:to-transparent"></div>
            </div>
            
            <div className="max-w-7xl mx-auto w-full relative z-10 px-6 md:px-10">
              <h2 className="text-[32px] md:text-[42px] font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight max-w-2xl text-left">
                {appSettings.heroHeading} <span className="text-[#049454]">{appSettings.heroHeadingHighlight}</span>
              </h2>
              <div className="flex items-center gap-6 mt-6">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleShopNow(); }}
                  className="bg-[#049454] text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/10 hover:bg-[#037c46] transition-all transform hover:scale-105 active:scale-95 shrink-0"
                >
                  Shop Now
                </button>
                <div className="flex gap-2">
                   {heroSlides.map((_, i) => (
                     <button key={i} onClick={(e) => { e.stopPropagation(); setHeroIndex(i); }} className={`h-1.5 transition-all duration-300 rounded-full ${i === heroIndex ? 'w-8 bg-[#049454]' : 'w-2 bg-slate-300 dark:bg-slate-700'}`} />
                   ))}
                </div>
              </div>
            </div>
          </header>

          <main id="stores-grid" className="max-w-7xl mx-auto px-6 md:px-10 py-10">
            {categoryFilter === 'Nearby Shops' && (
              <div className="mb-12 animate-in fade-in duration-700 text-left shrink-0">
                <div className="flex items-center gap-3 mb-6 shrink-0">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${isNearbyLoading ? 'bg-slate-200 dark:bg-slate-800 animate-pulse' : 'bg-[#049454]'}`}>
                      {isNearbyLoading ? <div className="w-5 h-5 border-2 border-[#049454] border-t-transparent rounded-full animate-spin"></div> : <span className="text-xl">📍</span>}
                   </div>
                   <div>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Hyper-Local Discovery</h3>
                      <p className="text-xs font-bold text-[#049454] uppercase tracking-widest">Organized Neighborhood Guide</p>
                   </div>
                </div>
                {isNearbyLoading ? (
                   <div className="p-12 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center shrink-0">
                      <div className="w-12 h-12 border-4 border-[#049454] border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                      <p className="text-slate-500 font-bold text-center">Scanning neighborhood map...</p>
                   </div>
                ) : nearbyDiscovery ? (
                   <div className="space-y-10 shrink-0">
                      <div className="p-8 bg-[#049454]/5 dark:bg-[#049454]/10 rounded-[40px] border border-[#049454]/20 shadow-sm shrink-0">
                         <p className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{nearbyDiscovery.text}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 shrink-0">
                         {nearbyDiscovery.categories.map((cat, idx) => (
                           <div key={idx} className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b dark:border-slate-800 pb-3 uppercase tracking-wider">{cat.name}</h4>
                              <div className="flex flex-wrap gap-2">
                                 {cat.shops.map((shop: any, i: number) => (
                                   <a key={i} href={shop.uri} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:border-[#049454]/50 transition-all flex items-center gap-2"><span>🗺️</span> {shop.title}</a>
                                 ))}
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                ) : null}
              </div>
            )}
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1.5 text-left shrink-0">{categoryFilter === 'Nearby Shops' ? 'Locality Verified Stores' : appSettings.dealsHeading}</h3>
            <p className="text-slate-500 font-medium mb-1.5 text-left shrink-0">{appSettings.dealsSubtext}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-8 shrink-0">
              {filteredStores.map(store => <StoreCard key={store.id} store={store} onClick={() => { setSelectedStore(store); setView('store-detail'); }} />)}
            </div>
          </main>
        </>
      )}

      {view === 'store-detail' && selectedStore && (
        <StoreDetail store={selectedStore} products={(allProducts[selectedStore.id] || []).filter(p => !p.isPrivate)} onBack={() => setView('home')} onAddToCart={addToCart} onProductClick={(p) => { setSelectedProduct(p); setView('product-detail'); }} />
      )}
      {view === 'product-detail' && selectedProduct && <ProductDetail product={selectedProduct} similarProducts={[]} onBack={() => setView('store-detail')} onAddToCart={addToCart} onBuyNow={(p) => { addToCart(p); setView('checkout'); }} onStoreClick={() => {}} onProductClick={(p) => setSelectedProduct(p)} />}

      {isCartOpen && (
        <div className="fixed inset-0 z-[140] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500 overflow-hidden text-left">
             <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center shrink-0"><h2 className="text-xl font-bold dark:text-white">Shopping Cart</h2><button onClick={() => setIsCartOpen(false)} className="text-slate-400 font-bold hover:text-slate-600 shrink-0">Close</button></div>
             <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
               {cart.length === 0 ? <p className="text-center py-20 text-slate-400 font-bold mx-auto">Your cart is empty</p> : cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center mb-6 shrink-0">
                      <div className="flex gap-4">
                        <img src={item.image} className="w-12 h-12 rounded-xl object-cover shrink-0" alt="" />
                        <div className="flex flex-col text-left shrink-0">
                          <span className="dark:text-white font-bold text-sm">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-[#049454] font-extrabold shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                 ))
               }
             </div>
             {cart.length > 0 && (
               <div className="p-8 border-t dark:border-slate-800 shrink-0">
                  <div className="flex justify-between mb-4 font-bold dark:text-white text-lg shrink-0"><span>Total Estimate</span><span className="text-[#049454]">₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span></div>
                  <button onClick={() => { setView('checkout'); setIsCartOpen(false); }} className="w-full bg-[#049454] text-white py-5 rounded-2xl font-bold shadow-lg shadow-emerald-900/10 hover:bg-[#037c46] transition-all shrink-0 mx-auto">Proceed to Checkout</button>
               </div>
             )}
          </div>
        </div>
      )}

      <footer className="bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-800 py-16 text-center text-slate-400 shrink-0">
        <p className="text-xs font-bold uppercase tracking-[0.2em] shrink-0 mx-auto">{appSettings.footerText}</p>
      </footer>
    </div>
  );
};

export default App;