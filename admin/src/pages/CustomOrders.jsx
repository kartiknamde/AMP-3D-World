import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CustomOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/custom-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/custom-orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (loading) return <div>Loading custom orders...</div>;

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-headings)', marginBottom: '32px' }}>Custom Orders Review</h1>
      <div style={{ display: 'grid', gap: '24px' }}>
        {orders.map(order => (
          <div key={order._id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {order.referenceImage && (
              <img 
                src={order.referenceImage} 
                alt="Reference" 
                style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            )}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                    Customer: {order.user?.name} ({order.user?.email})
                  </p>
                </div>
                <select 
                  value={order.status} 
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="in-production">In Production</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--text-dark)' }}>Customer Notes & Requirements:</h4>
                <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{order.notes || 'No specific notes provided.'}</p>
              </div>

              <div style={{ marginTop: '16px', fontSize: '14px' }}>
                <strong>Product Type / Category requested:</strong> {order.category || 'Not specified'}
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px' }}>No custom orders found</div>
        )}
      </div>
    </div>
  );
}
