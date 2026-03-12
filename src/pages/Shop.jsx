import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants/products';
import { fetchProducts } from '../api';
import { useCart } from '../context/CartContext';
import CustomizationModal from '../components/CustomizationModal';
import portraitImg from '../assets/portrait-figurine.png';
import heroImg from '../assets/hero-figurine.png';
import petImg from '../assets/pet-figurine.png';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const searchId = searchParams.get('id');
  const searchQuery = searchParams.get('search');
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [activeTab, setActiveTab] = useState('Divine Deity');
  const [priceRange, setPriceRange] = useState(2500);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Customization State
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);

  const customizableCategories = ['Couple Miniature', 'Pet Miniature', 'Art Miniature'];

  const handleActionClick = (product, isBuyNow) => {
    if (customizableCategories.includes(product.category)) {
      setSelectedProduct(product);
      setIsBuyNowFlow(isBuyNow);
      setCustomModalOpen(true);
    } else {
      addToCart(product);
      if (isBuyNow) {
        navigate('/checkout');
      } else {
        setIsCartOpen(true);
      }
    }
  };

  const handleCustomConfirm = (customizationData) => {
    addToCart(selectedProduct, customizationData);
    setCustomModalOpen(false);
    setSelectedProduct(null);
    
    if (isBuyNowFlow) {
      navigate('/checkout');
    } else {
      setTimeout(() => setIsCartOpen(true), 100);
    }
  };

  const featuredCollections = [
    { name: "Divine Deity", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgtZzWkROuQ06j8a6dXMC0LxuMU1UtVqek5GJ7NXCnT7gdwVLCkkhjHhPQq5yn7J0H8B7wzkAqPsFkwgNfylNmZ8ie6ZftlqKO6Dwyq8VlBi6IJllqPaSEeHTzEdT62xxkEMdj8YEfyObgVs8bd156x3vdCRN33agLwTbC95hCoHHuX__Rm3sZ9GEbJg0eKhrBXiYfaAGy0uvy8KJI-hCRvyoxiB2q-jhBCuzgMd6PxdlX9BGZjVbjtNJPTbqe5f1uDAu-gTutGs9p" },
    { name: "Couple Miniature", image: heroImg },
    { name: "Pet Miniature", image: petImg },
    { name: "Art Miniature", image: "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&q=80&w=800" }
  ];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchId) params.id = searchId;
        if (searchQuery) params.search = searchQuery;
        if (activeTab !== 'All') params.category = activeTab;

        const data = await fetchProducts(params);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchId, searchQuery, activeTab]);

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <style>{`
        .custom-brush-btn {
            position: relative;
            background: #f2930d;
            overflow: hidden;
            z-index: 1;
        }
        .custom-brush-btn::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transform: skewX(-20deg);
            z-index: -1;
        }
        .pattern-bg {
            background-color: #f2930d;
            background-image: radial-gradient(#800000 0.5px, transparent 0.5px), radial-gradient(#800000 0.5px, #f2930d 0.5px);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
            opacity: 0.1;
        }
        .fill-1 { font-variation-settings: 'FILL' 1; }
        
        /* Flipping Carousel Styles */
        .flipping-carousel {
          display: flex;
          gap: 24px;
          animation: flippingFlow 20s linear infinite;
          width: max-content;
        }
        
        .flipping-carousel:hover {
          animation-play-state: paused;
        }

        .flipping-card {
          width: 280px;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }

        .flipping-card:hover {
          transform: scale(1.05) rotateY(5deg);
        }

        @keyframes flippingFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-280px * 4 - 24px * 4)); }
        }

        /* Responsive pause on touch if needed */
        @media (hover: none) {
          .flipping-carousel {
            animation-play-state: running;
          }
        }
      `}</style>

      <main className="max-w-[1440px] mx-auto w-full px-6 md:px-20 py-6">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-2 py-4 items-center text-sm">
          <a className="text-slate-500 hover:text-primary font-medium" href="/">Home</a>
          <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
          <a className="text-slate-500 hover:text-primary font-medium" href="#">Shop</a>
          <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
          <span className="text-secondary font-bold">{activeTab}</span>
        </nav>

        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-xl md:rounded-3xl mb-10 bg-secondary">
          <div className="absolute inset-0 pattern-bg opacity-20"></div>
          <div className="relative z-10 grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-16 space-y-4">
              <span className="bg-primary/20 text-primary border border-primary/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Premium Collection</span>
              <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">Miniature Masterpieces</h1>
              <p className="text-background-light/80 text-lg max-w-md leading-relaxed">
                Explore our sophisticated range of 3D-printed miniatures. From divine deities to personalized family and pet portraits.
              </p>
            </div>
            <div className="flex justify-center md:justify-end p-8">
              <div className="relative w-64 h-64 md:w-80 md:h-80 group">
                <div className="absolute inset-0 bg-primary rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" 
                  alt="Featured Miniature" 
                  src={portraitImg}
                />
              </div>
            </div>
          </div>
          <div className="h-2 bg-primary/50 w-full"></div>
        </div>

        {/* Animated Flipping Carousel Section */}
        <div className="mb-16 overflow-hidden py-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-secondary">Our Featured Collections</h3>
            <div className="text-xs text-secondary font-bold uppercase tracking-widest bg-secondary/5 px-3 py-1 rounded-full">Hover to Pause</div>
          </div>
          
          <div className="relative">
            <div className="flipping-carousel">
              {/* Double mapping for infinite scroll effect */}
              {[...featuredCollections, ...featuredCollections].map((item, idx) => (
                <div 
                  key={idx} 
                  className="flipping-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 p-0"
                  onClick={() => setActiveTab(item.name)}
                >
                  <div className="h-48 md:h-56 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6 relative group">
                    <img src={item.image} className="h-full object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-500" alt={item.name} />
                    <div className="absolute bottom-4 left-4">
                       <span className="text-[10px] text-primary font-bold uppercase bg-primary/10 px-2 py-0.5 rounded">Collection</span>
                    </div>
                  </div>
                  <div className="p-6 bg-white flex justify-between items-center border-t border-slate-50">
                    <h4 className="font-bold text-secondary text-lg">{item.name}</h4>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-secondary">tune</span>
                <h3 className="text-lg font-bold text-secondary">Refine Search</h3>
              </div>
              <div className="space-y-6">
                {/* Category Filter */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Categories</h4>
                  <div className="space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${activeTab === cat ? 'bg-primary text-white font-medium' : 'hover:bg-primary/5 text-slate-700'}`}
                      >
                        <span>{cat}</span>
                        {activeTab === cat && <span className="material-symbols-outlined text-sm">check_circle</span>}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Price range */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Price Range</h4>
                  <div className="px-2">
                    <input 
                      className="w-full accent-primary bg-primary/20 h-1.5 rounded-full appearance-none cursor-pointer" 
                      type="range"
                      min="800"
                      max="2500"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                    />
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>₹800</span>
                      <span>₹2,500</span>
                    </div>
                  </div>
                </div>
                {/* Material Filter */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Material</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {['PLA', 'PETG', 'ABS', 'High Detail Resin'].map((mat) => (
                      <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                        <input className="rounded border-slate-300 text-primary focus:ring-primary w-5 h-5" type="checkbox"/>
                        <span className="text-slate-700 group-hover:text-primary transition-colors">{mat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <p className="text-slate-500">Showing <span className="font-bold text-slate-900">{products.length}</span> results for <span className="font-bold text-slate-900">{activeTab}</span></p>
              <select className="form-select w-full sm:w-48 border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm">
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-20 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading products...</p>
                </div>
              ) : products.map((product) => (
                <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
                  <div className="relative h-64 bg-slate-50 flex items-center justify-center p-6">
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase z-10">
                        {product.badge}
                      </span>
                    )}
                    <img 
                      className="h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                      alt={product.name} 
                      src={product.image}
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-secondary">{product.name}</h3>
                        <p className="text-xs text-slate-500">{product.material}</p>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-sm fill-1">star</span>
                        <span className="text-sm font-bold">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-slate-900">{product.price}</span>
                      {product.oldPrice && <span className="text-sm text-slate-400 line-through">{product.oldPrice}</span>}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleActionClick(product, false)}
                        className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-xs"
                      >
                        <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleActionClick(product, true)}
                        className="flex-1 py-2.5 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 text-xs"
                      >
                        <span className="material-symbols-outlined text-lg">payments</span>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && products.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
                  <h3 className="text-xl font-bold text-slate-400">No products found</h3>
                  <button onClick={() => setActiveTab('Divine Deity')} className="text-primary font-bold mt-4 hover:underline">View All Collections</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Customization Portal */}
      <CustomizationModal 
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        product={selectedProduct}
        onConfirm={handleCustomConfirm}
      />
    </div>
  );
};

export default Shop;
