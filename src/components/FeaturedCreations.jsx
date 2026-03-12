import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HOME_CATEGORIES } from '../constants/products';
import { fetchFeaturedProducts, fetchProducts } from '../api';

const FeaturedCreations = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let data;
        if (activeTab === 'All') {
          data = await fetchFeaturedProducts();
        } else {
          data = await fetchProducts({ category: activeTab });
        }
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeTab]);

  return (
    <section className="featured section" id="shop">
      <div className="container">
        <div className="featured-header text-center">
          <h2>Featured Creations</h2>
          <p>Explore our most loved handcrafted miniature designs.</p>
        </div>
        
        <div className="filter-tabs flex justify-center">
          {HOME_CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${activeTab === cat ? 'active' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="products-grid grid">
          {loading ? (
             <div className="col-span-full py-10 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
             </div>
          ) : (
            products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <div className="product-footer flex justify-between items-center">
                    <span className="product-price">{product.price}</span>
                    <Link to={`/shop?id=${product._id}`} className="btn btn-secondary btn-sm">View Details</Link>
                  </div>
                </div>
              </div>
            ))
          )}
          {!loading && products.length === 0 && (
            <div className="col-span-full py-20 text-center">
               <p className="text-muted">Coming soon to this collection!</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-60">
          <Link to="/shop" className="btn btn-secondary">View Full Catalog</Link>
        </div>
      </div>
      
      <style>{`
        .featured {
          background-color: var(--bg-primary);
        }
        
        .featured-header h2 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        
        .featured-header p {
          color: var(--text-muted);
          margin-bottom: 40px;
        }
        
        .filter-tabs {
          gap: 15px;
          margin-bottom: 50px;
        }
        
        .filter-btn {
          padding: 8px 20px;
          border-radius: 20px;
          border: 1px solid #ddd;
          background-color: white;
          font-weight: 500;
          color: var(--text-muted);
          transition: all 0.3s ease;
        }
        
        .filter-btn.active {
          background-color: var(--text-dark);
          color: white;
          border-color: var(--text-dark);
        }
        
        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 30px;
        }
        
        .product-card {
          background-color: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          transition: transform 0.3s ease;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
        }
        
        .product-image {
          height: 300px;
          background-color: #f8f8f8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .product-image img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }
        
        .product-info {
          padding: 20px;
        }
        
        .product-category {
          color: var(--text-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .product-info h3 {
          font-size: 1.1rem;
          margin: 5px 0 15px;
        }
        
        .product-price {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-dark);
        }
        
        .btn-sm {
          padding: 6px 15px;
          font-size: 0.85rem;
        }
        
        .mt-60 {
          margin-top: 60px;
        }
      `}</style>
    </section>
  );
};

export default FeaturedCreations;
