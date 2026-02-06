import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Search,
  User,
  Sparkles,
  Send,
  Loader2
} from 'lucide-react';

// --- fonts injection ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;600;800&display=swap');
    
    .font-brand { font-family: 'Anton', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    
    .stroke-text {
      -webkit-text-stroke: 2px white;
      color: transparent;
    }
  `}</style>
);

// --- Mock Data (T-SHIRTS ONLY) ---
const PRODUCTS = [
  {
    id: "f4-tee",
    name: "The Fantastic Four '97",
    price: 65,
    category: "Merch",
    colors: [
      { name: "Vintage White", class: "bg-[#F5F5F0]", hex: "#F5F5F0" },
      { name: "Faded Black", class: "bg-gray-900", hex: "#111827" }
    ],
    sizes: ["M", "L", "XL", "2XL"],
    images: [
      "https://instagram.fdel1-3.fna.fbcdn.net/v/t51.82787-15/535624466_17847724314542036_7382327412451755351_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=MzcwMzU0ODMxMTE0NTE5MDA3Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=rK9nO-E_uh4Q7kNvwGJSKid&_nc_oc=AdlOVrGM8VSWReTMJA8mJTbnBqpJS66RHT0YoxxmwuliKZ2kH8uQHnRuRDugm1yUeLI&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=instagram.fdel1-3.fna&_nc_gid=C2OG_rZq_jWhV93X3m80Aw&oh=00_Afv4EoybMtUVZxhoZK8mMEmZWU61T5s44zZV5bIdlGEFJA&oe=698BF3F5",
      "https://instagram.fdel1-7.fna.fbcdn.net/v/t51.82787-15/535670978_17847724323542036_4085854514222670906_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=MzcwMzU0ODMxMTE1MzQ5NzQ3NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjYxOXg2MTkuc2RyLkMzIn0%3D&_nc_ohc=HUY9chVgZroQ7kNvwHStwnd&_nc_oc=Admv8WVxlKgpOzKTfkhBIL6yUkN9oITp4sDWF9WFutqShGzFj4QtYZgxazNG9Ob1PxY&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=instagram.fdel1-7.fna&_nc_gid=C2OG_rZq_jWhV93X3m80Aw&oh=00_AfvzNnyF0FVHdnlqv7ALHEPcUOzNtMsp2JAjSq997P3j6w&oe=698C0D2D",
      "https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/535862644_17847724332542036_4197747226586064189_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=MzcwMzU0ODMxMTE0NTE1NTY0Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=RNCVbssEMOgQ7kNvwEt2169&_nc_oc=AdnTCgJISEkveFe8-UBHlt3QU7RGlHgiIY_a4RDhyIiLxYM9DL18eKL_pQUSwT8wTjw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_gid=CTRDCBac8fg9CfeM7y-xAA&oh=00_AftzxxyV_78JBPsfT0Rn9Zy4yIsD9sqBrfF-t0k8qiNgyQ&oe=698C1BE2",
      "https://scontent-fra3-2.cdninstagram.com/v/t51.82787-15/535887744_17847724341542036_3416254466606124695_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=MzcwMzU0ODMxMTE0NTE5MTU3NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=iZ336KbXk8sQ7kNvwGs7hK6&_nc_oc=AdlsMUg0h9FfbcXt9SJ20A83KW4uCp4J96eu6T6DuJh_bhry2VpUB17G6sIN8GaZVIk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-fra3-2.cdninstagram.com&_nc_gid=CTRDCBac8fg9CfeM7y-xAA&oh=00_AfvHhYPeh5oYVGlX_S-6aLOEylBH4pIuJ_p3_yx8iy_www&oe=698BF87F",
      "https://scontent-fra3-1.cdninstagram.com/v/t51.82787-15/535334743_17847724350542036_3899871149471944835_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=MzcwMzU0ODMxMTI4Nzg4NjU1OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=pi_jafSBhqAQ7kNvwGkFDAq&_nc_oc=Admhun0BtrVaKdt27IQRafRVkGuHtfPLaMddLr5FZMaMdmDc_e6ST8ku_XV8GskRPnk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_gid=CTRDCBac8fg9CfeM7y-xAA&oh=00_AfvP3lJk4InQkZ07Zl4taEKkW2vWgEoxNPjo27CGh8k_Vg&oe=698C26C2"
    ],
    description: "Ultra-heavyweight vintage wash featuring custom Fantastic Four '97 artwork. Retro Marvel aesthetics meets modern streetwear fit."
  },
  {
    id: 1,
    name: "Error 404: Chill Not Found",
    price: 45,
    category: "Meme",
    colors: [
      { name: "Black", class: "bg-black", hex: "#000000" },
      { name: "White", class: "bg-white border border-gray-200", hex: "#FFFFFF" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Heavyweight cotton tee featuring high-density puff print. For those days when you have absolutely zero chill."
  },
  {
    id: 2,
    name: "Loom X Signature Boxy",
    price: 55,
    category: "Merch",
    colors: [
      { name: "Charcoal", class: "bg-gray-800", hex: "#374151" },
      { name: "Cream", class: "bg-[#F5F5DC]", hex: "#F5F5DC" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=800"
    ],
    description: "The official uniform. Drop-shoulder silhouette with the iconic Loom X branding on the back."
  }
];

// --- Components ---

const Navbar = ({ cartCount, onOpenCart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navTextColor = scrolled ? 'text-black' : 'text-white';
  const navBg = scrolled ? 'bg-white/90 backdrop-blur-md border-b border-black/5' : 'bg-black/20 backdrop-blur-sm border-b border-white/10';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 py-4 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button className={`md:hidden ${navTextColor}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex items-center gap-2 cursor-pointer group">
          <div className={`flex flex-col items-start leading-none ${navTextColor}`}>
            <span className="text-[10px] font-bold tracking-[0.2em] font-body group-hover:text-red-600 transition-colors">THE</span>
            <span className="text-4xl font-brand uppercase tracking-tighter">LOOM STORE</span>
          </div>
        </div>

        <div className={`hidden md:flex space-x-12 text-sm font-bold tracking-widest uppercase font-body ${scrolled ? 'text-gray-500' : 'text-gray-300'}`}>
          {['Drops', 'Best Sellers', 'Community'].map((item) => (
            <a key={item} href="#" className={`transition-all hover:underline decoration-2 underline-offset-4 ${scrolled ? 'hover:text-black' : 'hover:text-white'}`}>{item}</a>
          ))}
        </div>

        <div className={`flex items-center space-x-6 ${navTextColor}`}>
          <Search size={22} className="hidden md:block cursor-pointer hover:scale-110 transition-transform" />
          <User size={22} className="hidden md:block cursor-pointer hover:scale-110 transition-transform" />
          <button onClick={onOpenCart} className="relative group">
            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-black/10 md:hidden p-6 flex flex-col space-y-4 shadow-xl">
          {['Drops', 'Best Sellers', 'Community'].map((item) => (
            <a key={item} href="#" className="text-xl font-brand uppercase text-black">{item}</a>
          ))}
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section className="relative h-[85vh] w-full bg-black overflow-hidden">
    <img 
      src="https://images.unsplash.com/photo-1549495574-6f4e6d246c1c?auto=format&fit=crop&q=80&w=2000" 
      alt="Hero" 
      className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-[2s]"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    
    <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 text-white">
      <div className="max-w-4xl">
        <div className="flex items-center gap-4 mb-4">
           <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">New Drop</span>
           <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-300">Volume 01</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-brand uppercase leading-[0.85] mb-8">
          WEAR YOUR<br/><span className="stroke-text">ATTITUDE</span>
        </h1>
        <button className="group flex items-center gap-4 bg-white text-black px-10 py-5 text-sm font-black tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all">
          Shop The Drop
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  </section>
);

const StylistModal = ({ product, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', text: `Yo. I'm the Loom X AI. You looking at the ${product.name}? That's a solid pick. What do you need to know?` }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = query;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setQuery('');
    setLoading(true);

    try {
      const apiKey = ""; 
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are the 'Loom X Stylist', a cool, streetwear-savvy fashion AI. The brand is 'The Loom Store' (or Loom X), selling trendy t-shirts (memes, merch, oversized, fitted).
                The user is looking at: "${product.name}" ($${product.price})
                Category: ${product.category}
                Description: ${product.description}
                User Query: "${userMessage}"
                Goal: Be short, hype up the product, use Gen Z slang, and suggest outfits. Under 50 words.`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "My wifi is tweaking, ask me again in a sec.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Connection error. Refresh the vibe." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg shadow-2xl flex flex-col max-h-[600px] border-2 border-black">
        <div className="bg-black p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-red-500 fill-red-500" />
            <h3 className="font-brand text-2xl text-white uppercase tracking-wide">Loom X Stylist</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 text-sm font-medium ${msg.role === 'user' ? 'bg-black text-white' : 'bg-white text-black border-2 border-black'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 border-2 border-black">
                <Loader2 size={20} className="animate-spin text-black" />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t-2 border-black bg-white">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="How do I style this?" 
              className="w-full bg-gray-100 border-2 border-transparent focus:border-black py-3 pl-4 pr-12 text-sm font-bold outline-none transition-colors placeholder:text-gray-400 font-body"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !query.trim()}
              className="absolute right-2 p-2 text-black hover:text-red-600 disabled:opacity-50 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, onOpenStylist }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <div className="group flex flex-col relative">
      <div className="absolute top-2 left-2 z-10 bg-black text-white text-[10px] font-bold uppercase px-2 py-1 tracking-widest">
        {product.category}
      </div>

      <div className="relative aspect-[4/5] overflow-hidden bg-gray-200 mb-4 cursor-pointer border border-transparent group-hover:border-black transition-all">
        <img 
          src={product.images[currentImageIndex]} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        
        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length); }} 
            className="bg-black/50 text-white p-2 hover:bg-black transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % product.images.length); }} 
            className="bg-black/50 text-white p-2 hover:bg-black transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-black p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-3">
           <div className="flex justify-center gap-2">
             {product.sizes.map(size => (
               <button 
                 key={size}
                 onClick={() => setSelectedSize(size)}
                 className={`w-8 h-8 text-xs font-bold border ${selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'} transition-colors`}
               >
                 {size}
               </button>
             ))}
           </div>
           <button 
            onClick={() => onAddToCart(product, product.colors[0], selectedSize || 'L')}
            className="w-full bg-red-600 text-white py-2 text-xs font-black uppercase tracking-widest hover:bg-black transition-colors"
          >
            Add To Cart
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-brand text-2xl uppercase text-black leading-none">{product.name}</h3>
          <span className="font-bold font-body text-lg text-black">${product.price}</span>
        </div>
        
        <button 
            onClick={() => onOpenStylist(product)}
            className="text-[10px] font-black tracking-widest uppercase text-gray-500 hover:text-black flex items-center gap-1 transition-colors group/ai"
        >
            <Sparkles size={12} className="text-gray-400 group-hover/ai:text-red-500 transition-colors" />
            AI Stylist
        </button>
      </div>
    </div>
  );
};

const CartSidebar = ({ isOpen, onClose, cartItems, onRemove }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b-2 border-black flex items-center justify-between bg-black text-white">
            <h2 className="font-brand text-3xl uppercase tracking-wider">Cart ({cartItems.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-red-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <ShoppingBag size={64} strokeWidth={1} />
                <p className="font-brand text-xl uppercase">Your bag is empty.</p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-4 border-b border-gray-100 pb-4 text-black">
                  <div className="w-20 h-24 bg-gray-100 overflow-hidden border border-gray-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between mb-1">
                        <h4 className="font-brand text-xl uppercase leading-none">{item.name}</h4>
                        <span className="font-bold text-lg">${item.price}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        {item.size}
                      </p>
                    </div>
                    <button 
                      onClick={() => onRemove(index)}
                      className="text-xs font-bold text-red-500 hover:text-black uppercase self-start tracking-wider"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t-2 border-black bg-gray-50">
            <div className="flex justify-between mb-6 text-black font-brand text-2xl uppercase">
              <span>Total</span>
              <span>${total}</span>
            </div>
            <button className="w-full bg-black text-white py-4 text-sm font-black tracking-[0.2em] uppercase hover:bg-red-600 transition-colors">
              Secure Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStylistProduct, setActiveStylistProduct] = useState(null);

  const addToCart = (product, color, size) => {
    const newItem = { ...product, color: color.name, size: size, image: product.images[0] };
    setCart([...cart, newItem]);
    setCartOpen(true);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-white font-body text-black selection:bg-red-500 selection:text-white">
      <FontStyles />
      <Navbar cartCount={cart.length} onOpenCart={() => setCartOpen(true)} />
      
      {activeStylistProduct && (
        <StylistModal product={activeStylistProduct} onClose={() => setActiveStylistProduct(null)} />
      )}

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} cartItems={cart} onRemove={removeFromCart} />

      <Hero />

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-24 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-brand mb-6 text-black uppercase leading-[0.9]">
            Defined by <br/><span className="text-red-600">Culture</span>
          </h2>
          <p className="text-lg font-medium text-gray-500 max-w-xl mx-auto">
            The Loom X collection isn't just fabric. It's a statement. Oversized cuts, heavy cotton, and designs that speak louder than you do.
          </p>
        </div>

        <div className="flex flex-wrap justify-center mb-16 gap-6 border-b border-black/10 pb-6">
          {['All', 'Meme', 'Merch', 'Oversized', 'Fitted'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-lg font-brand uppercase tracking-wider transition-all px-4 py-2 ${
                activeCategory === cat ? 'bg-black text-white -rotate-2' : 'text-gray-400 hover:text-black hover:-rotate-2'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {PRODUCTS
            .filter(p => activeCategory === 'All' || p.category === activeCategory)
            .map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} onOpenStylist={setActiveStylistProduct} />
          ))}
        </div>
      </main>

      <footer className="bg-black text-white py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h4 className="font-brand text-5xl mb-6">THE LOOM X.</h4>
            <p className="text-gray-400 max-w-xs font-medium">Streetwear for the chronically online and the fashionably late.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            <div>
              <h5 className="text-red-500 text-xs font-black tracking-widest uppercase mb-6">Collection</h5>
              <ul className="space-y-3 font-brand text-xl tracking-wide">
                <li><a href="#" className="hover:text-red-500 transition-colors">Meme Tees</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Oversized</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Merch</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;