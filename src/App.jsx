import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot,
} from 'firebase/firestore';
import { 
  ShoppingBag, 
  X, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  Package,
  ChevronRight,
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'loom-store-prod';

// CUSTOM ASSETS
const BANNER_IMG = "https://instagram.fdel27-6.fna.fbcdn.net/v/t51.82787-15/535624466_17847724314542036_7382327412451755351_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=MzcwMzU0ODMxMTE0NTE5MDA3Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=rK9nO-E_uh4Q7kNvwHmhEOJ&_nc_oc=Adn-E-7vNbbGMs1lfeZW4h-2ZZi_GbrfwmhuxeuvV72X6ElJLk5IGhgSp1Fbv-qlWq5OYa8fbGNdfGkZtlmg2wuI&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=instagram.fdel27-6.fna&_nc_gid=Q61nawWdIYi4I64Kws06tA&oh=00_AfuZdTxyovgi0Af3oR1NwLNnCpFsDK0sS1-1tSvY3T7o-A&oe=698C2C35";

const PRODUCTS = [
    {
        id: "f4-tee",
        name: "The Fantastic Four '97",
        price: 65,
        category: "Merch",
        colors: [
            { name: "Vintage Black", hex: "#1A1A1A" },
            { name: "Off White", hex: "#F5F5F0" }
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        images: [
            BANNER_IMG,
            "https://instagram.fdel27-4.fna.fbcdn.net/v/t51.82787-15/535862644_17847724332542036_4197747226586064189_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102",
            "https://instagram.fdel27-6.fna.fbcdn.net/v/t51.82787-15/535887744_17847724341542036_3416254466606124695_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111",
            "https://instagram.fdel27-5.fna.fbcdn.net/v/t51.82787-15/535670978_17847724323542036_4085854514222670906_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103"
        ],
        description: "The ultimate '97 nostalgia drop. Custom screen-printed graphics on a premium boxy-fit silhouette. 300GSM cotton fleece interior. Hand-finished details."
    },
    {
        id: "loom-beanie",
        name: "The Loom Beanie",
        price: 25,
        category: "Merch",
        colors: [{ name: "Charcoal", hex: "#333333" }],
        sizes: ["OS"],
        images: [
          "https://images.unsplash.com/photo-1576871337622-98d48d890e49?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1611911813524-abae53905339?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Double-layered ribbed knit with the signature Loom tag. One size fits all."
    },
    {
        id: "meme-error",
        name: "Error 404 Tee",
        price: 45,
        category: "Meme",
        colors: [{ name: "Cloud White", hex: "#FFFFFF" }],
        sizes: ["M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800"
        ],
        description: "Digital culture meets high fashion. Relaxed fit, 100% organic cotton."
    }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          if (!auth.currentUser) {
            await signInAnonymously(auth);
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && !currentUser.isAnonymous) {
        setIsAuthModalOpen(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const cartDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'cart');
    const unsubscribe = onSnapshot(cartDoc, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCart(data.items || []);
      }
    }, (err) => console.error("Firestore sync error:", err));
    return () => unsubscribe();
  }, [user]);

  const updateRemoteCart = async (newCart) => {
    if (!user) return;
    const cartDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'cart');
    await setDoc(cartDoc, { items: newCart }, { merge: true });
  };

  const addToCart = async (product, size, color) => {
    const newItem = { ...product, size, color, cartId: Date.now() };
    const updatedCart = [...cart, newItem];
    setCart(updatedCart);
    await updateRemoteCart(updatedCart);
    setIsCartOpen(true);
  };

  const removeFromCart = async (cartId) => {
    const updatedCart = cart.filter(item => item.cartId !== cartId);
    setCart(updatedCart);
    await updateRemoteCart(updatedCart);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign in error", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;600;800&display=swap');
        .font-brand { font-family: 'Anton', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .stroke-text { -webkit-text-stroke: 1px white; color: transparent; }
        @media (min-width: 768px) { .stroke-text { -webkit-text-stroke: 2px white; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 py-4 px-4 md:px-12 flex justify-between items-center ${view === 'home' ? 'text-white' : 'text-black bg-white shadow-sm'}`}>
        <div onClick={() => { setView('home'); setSelectedProduct(null); }} className="cursor-pointer group">
          <p className="text-[8px] md:text-[10px] font-bold tracking-[0.3em] leading-none mb-1">THE</p>
          <h1 className="text-2xl md:text-4xl font-brand tracking-tighter leading-none group-hover:text-red-600 transition-colors">LOOM STORE</h1>
        </div>

        <div className="flex gap-4 md:gap-10 overflow-x-auto no-scrollbar px-2">
            <button onClick={() => { setFilter('all'); setView('home'); }} className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap hover:text-red-600 transition-colors ${filter === 'all' ? 'underline underline-offset-4 decoration-2' : ''}`}>New</button>
            <button onClick={() => { setFilter('Merch'); setView('home'); }} className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap hover:text-red-600 transition-colors ${filter === 'Merch' ? 'underline underline-offset-4 decoration-2' : ''}`}>Merch</button>
            <button onClick={() => { setFilter('Meme'); setView('home'); }} className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap hover:text-red-600 transition-colors ${filter === 'Meme' ? 'underline underline-offset-4 decoration-2' : ''}`}>Meme</button>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => (user && !user.isAnonymous) ? setView('profile') : setIsAuthModalOpen(true)} className="hover:scale-110 transition-transform">
            {user && !user.isAnonymous && user.photoURL ? (
                <img src={user.photoURL} className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-current" alt="Avatar" />
            ) : (
                <User className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
          <button onClick={() => setIsCartOpen(true)} className="relative hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* VIEWS */}
      {view === 'home' && <HomeView setView={setView} setProduct={setSelectedProduct} filter={filter} />}
      {view === 'detail' && <ProductDetail product={selectedProduct} onBack={() => setView('home')} onAdd={addToCart} />}
      {view === 'profile' && <ProfileView user={user} onBack={() => setView('home')} />}

      {/* MODALS */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={removeFromCart} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        user={user} 
        onGoogleSignIn={handleGoogleSignIn}
      />
    </div>
  );
}

function HomeView({ setView, setProduct, filter }) {
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="animate-in fade-in duration-700">
      <header className="relative h-[90vh] md:h-screen flex items-center px-6 md:px-12 bg-black overflow-hidden">
        <img 
          src={BANNER_IMG}
          className="absolute inset-0 w-full h-full object-cover object-top opacity-70"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-[10rem] font-brand uppercase leading-[0.85] mb-6 text-white">
            THE NEW<br/><span className="stroke-text">ERA</span>
          </h2>
          <p className="max-w-xs md:max-w-md text-white/80 text-[10px] md:text-sm font-medium uppercase tracking-widest leading-loose mb-8">
            Heritage craftsmanship meets digital aesthetics. Dropping the '97 collection.
          </p>
          <button 
            onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-black px-8 md:px-12 py-4 md:py-5 text-xs md:text-base font-black uppercase tracking-widest flex items-center gap-4 hover:bg-red-600 hover:text-white transition-all transform hover:translate-x-2"
          >
            Shop Now <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </header>

      <section id="collection" className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-32">
        <div className="flex justify-between items-end mb-12 md:mb-20 border-b-2 md:border-b-4 border-black pb-4 md:pb-8">
          <h3 className="text-4xl md:text-9xl font-brand uppercase leading-none">{filter === 'all' ? 'Collection' : filter}</h3>
          <p className="font-brand text-sm md:text-2xl uppercase opacity-20">{filtered.length} Items</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {filtered.map(p => (
            <div key={p.id} onClick={() => { setProduct(p); setView('detail'); }} className="group cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100 border border-gray-200 mb-4 md:mb-6">
                <img src={p.images[0]} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
              </div>
              <div className="flex justify-between items-start font-brand">
                <h4 className="text-2xl md:text-3xl uppercase leading-none">{p.name}</h4>
                <p className="text-lg md:text-xl opacity-60">${p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductDetail({ product, onBack, onAdd }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const nextImg = () => {
    setCurrentImgIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImg = () => {
    setCurrentImgIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 pt-24 md:pt-40 pb-20 animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-3 mb-8 md:mb-12 font-black uppercase text-[10px] tracking-widest hover:text-red-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">
        <div className="relative group w-full">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 border-2 border-black">
                <img 
                    src={product.images[currentImgIndex]} 
                    className="w-full h-full object-cover transition-all duration-500" 
                    alt={`${product.name} ${currentImgIndex}`} 
                />
                
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={prevImg} 
                        className="bg-white/90 p-3 border border-black hover:bg-black hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextImg} 
                        className="bg-white/90 p-3 border border-black hover:bg-black hover:text-white transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                <div className="absolute bottom-6 right-6 bg-black text-white px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                    {currentImgIndex + 1} / {product.images.length}
                </div>
            </div>

            <div className="flex gap-4 mt-6 overflow-x-auto no-scrollbar py-2">
                {product.images.map((img, i) => (
                    <button 
                        key={i} 
                        onClick={() => setCurrentImgIndex(i)}
                        className={`flex-shrink-0 w-20 h-24 border-2 transition-all ${currentImgIndex === i ? 'border-black opacity-100 scale-105' : 'border-gray-200 opacity-40 hover:opacity-60'}`}
                    >
                        <img src={img} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>

        <div className="md:sticky md:top-40 h-fit flex flex-col">
          <h2 className="text-4xl md:text-8xl font-brand uppercase leading-[0.9] mb-4">{product.name}</h2>
          <p className="text-2xl md:text-3xl font-black mb-6 md:mb-8">${product.price}</p>
          <p className="text-gray-500 text-sm md:text-lg leading-relaxed mb-8 md:mb-12 font-body">{product.description}</p>

          <div className="space-y-8 md:space-y-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">Select Size</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {product.sizes.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSize(s)}
                    className={`w-12 h-12 md:w-14 md:h-14 border-2 font-black transition-all ${size === s ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">Color: <span className="opacity-40">{color}</span></p>
              <div className="flex gap-4">
                {product.colors.map(c => (
                  <button 
                    key={c.name} 
                    onClick={() => setColor(c.name)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all ${color === c.name ? 'border-black scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={() => onAdd(product, size, color)}
              className="w-full bg-black text-white py-4 md:py-6 text-sm md:text-xl font-black uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center justify-center gap-4"
            >
              Add To Bag <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSidebar({ isOpen, onClose, items, onRemove }) {
  const total = items.reduce((acc, item) => acc + item.price, 0);
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      <div className={`fixed top-0 right-0 h-full w-full md:max-w-md bg-white z-[120] shadow-2xl transition-transform duration-500 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 md:p-8 border-b-2 border-black flex justify-between items-center bg-black text-white">
          <h3 className="text-2xl md:text-3xl font-brand uppercase tracking-tighter">Your Bag</h3>
          <button onClick={onClose} className="p-2 hover:bg-red-600 transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
              <ShoppingBag className="w-12 h-12 mb-4" />
              <p className="font-brand text-xl uppercase">Empty Bag</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.cartId} className="flex gap-4 animate-in slide-in-from-right-2">
                <img src={item.images[0]} className="w-20 h-24 object-cover border border-black flex-shrink-0" />
                <div className="flex-1">
                    <div className="flex justify-between"><h4 className="font-brand text-lg uppercase leading-none">{item.name}</h4><button onClick={() => onRemove(item.cartId)}><Trash2 className="w-4 h-4 text-gray-400" /></button></div>
                    <p className="text-[9px] font-black uppercase opacity-40 mb-2">{item.size} / {item.color}</p>
                    <p className="font-black">${item.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-6 md:p-8 border-t-2 border-black bg-gray-50">
          <div className="flex justify-between mb-6"><span className="font-brand uppercase opacity-40">Total</span><span className="font-brand text-3xl tracking-tighter">${total}</span></div>
          <button className="w-full bg-black text-white py-4 md:py-6 font-black uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50" disabled={items.length === 0}>Checkout</button>
        </div>
      </div>
    </>
  );
}

function AuthModal({ isOpen, onClose, user, onGoogleSignIn }) {
  const [authMode, setAuthMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (authMode === 'login' || authMode === 'email') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative bg-white w-full max-w-sm p-8 md:p-10 border-t-8 border-red-600 animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-6 right-6 hover:rotate-90 transition-transform"><X className="w-5 h-5" /></button>
        
        <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-brand uppercase mb-2">
                {authMode === 'login' ? 'Member Login' : 'Join The Loom'}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Official Access</p>
        </div>

        {error && (
            <div className="mb-6 bg-red-50 text-red-600 text-[10px] p-3 font-black uppercase tracking-widest border-l-4 border-red-600">
                {error}
            </div>
        )}

        <div className="space-y-4">
            {authMode === 'email' || authMode === 'signup' ? (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="email" 
                            placeholder="EMAIL ADDRESS"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-100 border-none py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="PASSWORD"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-100 border-none py-4 pl-12 pr-12 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                    >
                        {loading ? 'Processing...' : 'Verify Access'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setAuthMode('login')}
                        className="w-full text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-opacity"
                    >
                        Back to Options
                    </button>
                </form>
            ) : (
                <>
                    <button 
                        onClick={onGoogleSignIn}
                        className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-3 group"
                    >
                        <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg> 
                        Google One-Tap
                    </button>

                    <button 
                        onClick={() => setAuthMode('email')}
                        className="w-full bg-white text-black border-2 border-black py-4 font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                        <Mail className="w-4 h-4" /> Email & Password
                    </button>
                    
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[10px] font-black uppercase opacity-30">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <button onClick={onClose} className="w-full border-2 border-gray-100 py-4 font-black uppercase tracking-widest hover:border-black transition-all flex items-center justify-center gap-3">
                        Guest Access <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="pt-6 text-center">
                        <button 
                            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                            className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                        >
                            {authMode === 'login' ? "Don't have an account? Sign Up" : "Already a member? Log In"}
                        </button>
                    </div>
                </>
            )}
        </div>
        
        <p className="text-[7px] text-center uppercase font-bold tracking-[0.2em] opacity-20 mt-8">Secure Authentication Protected by Loom Security</p>
      </div>
    </div>
  );
}

function ProfileView({ user, onBack }) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 mb-4 font-black uppercase text-[10px] tracking-widest hover:text-red-600"><ArrowLeft className="w-4 h-4" /> Home</button>
          <h2 className="text-6xl md:text-9xl font-brand uppercase leading-none">Account</h2>
        </div>
        <button onClick={() => { signOut(auth); onBack(); }} className="bg-black text-white px-6 py-3 font-black uppercase tracking-widest hover:bg-red-600 transition-colors">Sign Out</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-black text-white p-6 md:p-12">
            <div className="flex items-center gap-6 mb-8">
                {user?.photoURL ? (
                    <img src={user.photoURL} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white" alt="Profile" />
                ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white flex items-center justify-center bg-gray-800">
                        <User className="w-8 h-8" />
                    </div>
                )}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Authenticated As</p>
                    <h3 className="text-2xl md:text-4xl font-brand uppercase">{user?.displayName || (user?.isAnonymous ? 'Guest Member' : 'Loom Member')}</h3>
                    <p className="text-xs opacity-60">{user?.email || 'No email attached'}</p>
                </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Member Reference</p>
            <p className="font-mono text-[10px] md:text-xs break-all opacity-40 mb-8">{user?.uid}</p>
        </div>

        <div className="border-2 border-black p-6 md:p-12">
            <h4 className="text-2xl font-brand uppercase mb-6">Order History</h4>
            <div className="flex flex-col items-center justify-center py-10 opacity-20 border-t border-black/10">
                <Package className="w-10 h-10 mb-4" />
                <p className="font-brand uppercase text-sm">No Recent Drops</p>
            </div>
        </div>
      </div>
    </div>
  );
}