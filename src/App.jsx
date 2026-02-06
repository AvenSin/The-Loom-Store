import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ShoppingBag, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Search,
  Trash2
} from 'lucide-react';

// --- fonts injection ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;600;800&display=swap');
    .font-brand { font-family: 'Anton', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    .stroke-text { -webkit-text-stroke: 2px white; color: transparent; }
    .polaroid {
      background: white;
      padding: 12px 12px 40px 12px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      border: 1px solid rgba(0,0,0,0.1);
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .polaroid:hover { transform: scale(1.05) rotate(0deg) !important; z-index: 50; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #000; }
  `}</style>
);

const PRODUCTS = [
  {
    id: "f4-tee",
    name: "The Fantastic Four '97",
    price: 65,
    category: "Merch",
    images: [
      "https://instagram.fdel1-3.fna.fbcdn.net/v/t51.82787-15/535624466_17847724314542036_7382327412451755351_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=MzcwMzU0ODMxMTE0NTE5MDA3Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=rK9nO-E_uh4Q7kNvwGJSKid&_nc_oc=AdlOVrGM8VSWReTMJA8mJTbnBqpJS66RHT0YoxxmwuliKZ2kH8uQHnRuRDugm1yUeLI&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=instagram.fdel1-3.fna&_nc_gid=C2OG_rZq_jWhV93X3m80Aw&oh=00_Afv4EoybMtUVZxhoZK8mMEmZWU61T5s44zZV5bIdlGEFJA&oe=698BF3F5",
      "https://instagram.fdel1-7.fna.fbcdn.net/v/t51.82787-15/535670978_17847724323542036_4085854514222670906_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=MzcwMzU0ODMxMTE1MzQ5NzQ3NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjYxOXg2MTkuc2RyLkMzIn0%3D&_nc_ohc=HUY9chVgZroQ7kNvwHStwnd&_nc_oc=Admv8WVxlKgpOzKTfkhBIL6yUkN9oITp4sDWF9WFutqShGzFj4QtYZgxazNG9Ob1PxY&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=instagram.fdel1-7.fna&_nc_gid=C2OG_rZq_jWhV93X3m80Aw&oh=00_AfvzNnyF0FVHdnlqv7ALHEPcUOzNtMsp2JAjSq997P3j6w&oe=698C0D2D"
    ],
    description: "Ultra-heavyweight vintage wash featuring custom Fantastic Four '97 artwork."
  },
  {
    id: "meme-1",
    name: "Error 404: Chill Not Found",
    price: 45,
    category: "Meme",
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800"],
    description: "Heavyweight cotton tee featuring high-density puff print."
  },
  {
    id: "f4-hoodie",
    name: "Doom Box Hoodie",
    price: 120,
    category: "Merch",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800"],
    description: "450GSM French Terry. Boxy fit."
  },
  {
    id: "meme-2",
    name: "Touch Grass Club",
    price: 40,
    category: "Meme",
    images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800"],
    description: "Screen printed on premium organic cotton."
  }
];

const Navbar = ({ cartCount, onOpenCart, filter, setFilter }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, val) => {
    e.preventDefault();
    setFilter(val);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const textColor = scrolled ? 'text-black' : 'text-white';
  const bgColor = scrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5';

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 border-b ${bgColor} ${scrolled ? 'border-black/5' : 'border-white/10'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div onClick={(e) => handleNavClick(e, 'all')} className={`flex flex-col items-start leading-none cursor-pointer transition-colors duration-500 ${textColor}`}>
          <span className="text-[10px] font-bold tracking-[0.2em] font-body">THE</span>
          <span className="text-4xl font-brand uppercase tracking-tighter">LOOM STORE</span>
        </div>
        <div className={`hidden md:flex space-x-12 text-[11px] font-black tracking-[0.2em] uppercase transition-colors duration-500 ${scrolled ? 'text-gray-500' : 'text-gray-300'}`}>
          <a href="#" onClick={(e) => handleNavClick(e, 'Merch')} className={`hover:underline decoration-2 underline-offset-8 ${filter === 'Merch' ? 'text-red-600' : ''}`}>Merch</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'Meme')} className={`hover:underline decoration-2 underline-offset-8 ${filter === 'Meme' ? 'text-red-600' : ''}`}>Memes</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'all')} className={`hover:underline decoration-2 underline-offset-8 ${filter === 'all' && scrolled ? 'text-black' : ''}`}>New Arrivals</a>
        </div>
        <div className={`flex items-center space-x-6 transition-colors duration-500 ${textColor}`}>
          <Search size={20} className="cursor-pointer hover:scale-110 transition-transform" />
          <button onClick={onOpenCart} className="relative group">
            <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
            {cartCount > 0 && <span className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${scrolled ? 'bg-black text-white' : 'bg-red-600 text-white'}`}>{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

const CartSidebar = ({ isOpen, onClose, cartItems, onRemove }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[120] shadow-2xl transform transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b-2 border-black flex items-center justify-between bg-black text-white">
            <h2 className="font-brand text-3xl uppercase">Your Bag ({cartItems.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-red-600 transition-colors"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <ShoppingBag size={64} strokeWidth={1} /><p className="font-brand text-xl uppercase">Nothing here yet.</p>
              </div>
            ) : cartItems.map((item, index) => (
              <div key={index} className="flex gap-4 border-b border-gray-100 pb-4 text-black">
                <div className="w-20 h-24 bg-gray-100 overflow-hidden border border-gray-200">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-brand text-xl uppercase">{item.name}</h4>
                    <span className="font-bold text-lg">${item.price}</span>
                  </div>
                  <button onClick={() => onRemove(index)} className="text-xs font-bold text-red-500 uppercase flex items-center gap-1"><Trash2 size={12} /> Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t-2 border-black bg-gray-50">
            <div className="flex justify-between mb-6 text-black font-brand text-2xl uppercase"><span>Subtotal</span><span>${total}</span></div>
            <button className="w-full bg-black text-white py-4 text-sm font-black tracking-[0.2em] uppercase hover:bg-red-600 transition-colors">Checkout Now</button>
          </div>
        </div>
      </div>
    </>
  );
};

const ProductCard = ({ product, onAddToCart }) => {
  const [imgIdx, setImgIdx] = useState(0);
  return (
    <div className="group flex flex-col gap-4 mb-16">
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden border border-gray-200 group-hover:border-black transition-all">
        <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {product.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setImgIdx(i => (i - 1 + product.images.length) % product.images.length)} className="bg-white/90 p-2"><ChevronLeft size={20} /></button>
            <button onClick={() => setImgIdx(i => (i + 1) % product.images.length)} className="bg-white/90 p-2"><ChevronRight size={20} /></button>
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-white p-4 border-t-2 border-black translate-y-full group-hover:translate-y-0 transition-transform">
           <button onClick={() => onAddToCart(product)} className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors">Add to Cart</button>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <h3 className="font-brand text-3xl uppercase leading-none">{product.name}</h3>
        <span className="font-black text-xl">${product.price}</span>
      </div>
    </div>
  );
};

const App = () => {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); 
  const addToCart = (p) => { setCart([...cart, p]); setCartOpen(true); };
  const removeFromCart = (i) => setCart(cart.filter((_, idx) => idx !== i));
  const filteredProducts = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-white font-body selection:bg-red-500 selection:text-white">
      <FontStyles />
      <Navbar cartCount={cart.length} onOpenCart={() => setCartOpen(true)} filter={activeFilter} setFilter={setActiveFilter} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} cartItems={cart} onRemove={removeFromCart} />
      
      <section className="relative h-screen bg-black overflow-hidden flex items-center px-8 md:px-20">
        <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="text-white">
            <h1 className="text-7xl md:text-[10rem] font-brand uppercase leading-[0.8] mb-10">WEAR YOUR<br/><span className="stroke-text">ATTITUDE</span></h1>
            <button onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} className="group flex items-center gap-4 bg-white text-black px-10 py-5 text-sm font-black uppercase hover:bg-red-600 hover:text-white transition-all">Shop Now <ArrowRight size={20} /></button>
          </div>
        </div>
      </section>

      <main id="products-section" className="max-w-7xl mx-auto px-6 py-32">
        <div className="border-b-4 border-black pb-4 mb-20">
          <h2 className="text-6xl md:text-8xl font-brand uppercase leading-none">{activeFilter === 'all' ? 'The Collection' : activeFilter}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
        </div>
      </main>
    </div>
  );
};

// --- RENDER LOGIC FOR VERCEL ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}

export default App;