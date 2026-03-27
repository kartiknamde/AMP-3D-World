import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Products({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', image: '', rating: '5.0' });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAdd(false);
      setNewProduct({ name: '', category: '', price: '', image: '', rating: '5.0' });
      fetchProducts();
    } catch (err) {
      console.error('Failed to add product', err);
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-headings)', margin: 0 }}>Inventory Management</h1>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showAdd && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Add Product</h2>
          <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Product Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} required style={{ width: '100%' }} />
              {newProduct.image && <img src={newProduct.image} alt="Preview" style={{ marginTop: '8px', height: '100px', borderRadius: '4px' }} />}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Name</label>
              <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Category</label>
              <input type="text" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Price (₹)</label>
              <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Rating</label>
              <input type="text" value={newProduct.rating} onChange={e => setNewProduct({...newProduct, rating: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Product</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {products.map(product => (
          <div key={product._id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <img 
              src={product.image.startsWith('data:') ? product.image : `http://localhost:5173/images/${product.image}`} 
              alt={product.name} 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
              onError={(e) => { e.target.onerror = null; e.target.src = product.image; }}
            />
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{product.name}</h3>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>₹{product.price}</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>{product.category}</p>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px' }}>No products found</div>
        )}
      </div>
    </div>
  );
}
