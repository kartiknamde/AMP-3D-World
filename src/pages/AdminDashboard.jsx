import React, { useState, useEffect } from 'react';
import { getAllCustomOrdersAdmin, updateCustomOrderAdmin } from '../api';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomOrdersAdmin();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await updateCustomOrderAdmin(id, { 
        status, 
        finalPrice: editPrice ? Number(editPrice) : undefined,
        adminNotes: editNotes || undefined
      });
      setEditingId(null);
      fetchOrders();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  const startEdit = (order) => {
    setEditingId(order._id);
    setEditPrice(order.finalPrice || order.estimatedPrice || '');
    setEditNotes(order.adminNotes || '');
  };

  if (loading) return <div className="text-center py-20">Loading Admin Dashboard...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary mb-8">Admin Dashboard - Custom Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center text-slate-500">No custom orders found.</div>
        ) : (
          <div className="grid gap-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6">
                
                {/* Reference Image */}
                <div className="w-full md:w-48 h-48 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                  <img src={order.referenceImage} alt="Reference" className="w-full h-full object-cover" />
                </div>
                
                {/* Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2
                        ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                          order.status === 'approved' ? 'bg-blue-100 text-blue-700' : 
                          order.status === 'paid' ? 'bg-green-100 text-green-700' : 
                          'bg-red-100 text-red-700'}`}>
                        {order.status.toUpperCase()}
                      </span>
                      <p className="text-sm text-slate-500">Order ID: {order._id}</p>
                      <p className="text-sm text-slate-500">User: {order.user?.name || 'Unknown'} ({order.user?.email || 'N/A'})</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Est. Price</p>
                      <p className="text-xl font-bold text-slate-800">₹{order.estimatedPrice?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-y border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400">Height</p>
                      <p className="font-semibold text-slate-800">{order.height} inches</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Material</p>
                      <p className="font-semibold text-slate-800">{order.material.split(' ')[0]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Complexity</p>
                      <p className="font-semibold text-slate-800">{order.complexity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Created At</p>
                      <p className="font-semibold text-slate-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Edit Actions */}
                  {editingId === order._id ? (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Final Approved Price (₹)</label>
                          <input 
                            type="number" 
                            className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-primary"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Admin Notes (visible to user)</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-primary"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="e.g., We need to alter the base slightly."
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleAction(order._id, 'approved')} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm transition-colors">
                          Approve Quote
                        </button>
                        <button onClick={() => handleAction(order._id, 'rejected')} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition-colors">
                          Reject Order
                        </button>
                        <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg text-sm transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mt-2">
                       <div>
                          {order.finalPrice && <p className="text-sm"><strong>Final Price:</strong> ₹{order.finalPrice.toLocaleString('en-IN')}</p>}
                          {order.adminNotes && <p className="text-sm text-slate-600"><strong>Notes:</strong> {order.adminNotes}</p>}
                       </div>
                       
                       {order.status === 'pending' && (
                         <button 
                           onClick={() => startEdit(order)}
                           className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm"
                         >
                           Review & Quote
                         </button>
                       )}
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
