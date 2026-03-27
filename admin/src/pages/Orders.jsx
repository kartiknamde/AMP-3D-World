import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/orders', {
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
      await axios.put(`http://localhost:5000/api/admin/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-headings)', marginBottom: '32px' }}>Orders Management</h1>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflowX: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead style={{ backgroundColor: 'var(--bg-primary)' }}>
            <tr>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Order ID</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Customer</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Total</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Payment</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Shipping Status</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>{order._id}</td>
                <td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  {order.shippingAddress?.name}<br/>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.shippingAddress?.phone}</span>
                </td>
                <td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>₹{order.totalAmount}</td>
                <td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>{order.paymentStatus}</td>
                <td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    backgroundColor: order.shipmentStatus === 'delivered' ? '#d1fae5' : order.shipmentStatus === 'shipped' ? '#dbeafe' : '#fef3c7',
                    color: order.shipmentStatus === 'delivered' ? '#065f46' : order.shipmentStatus === 'shipped' ? '#1e40af' : '#92400e'
                  }}>
                    {order.shipmentStatus}
                  </span>
                </td>
                <td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <select 
                    value={order.shipmentStatus} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '32px', textAlign: 'center' }}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
