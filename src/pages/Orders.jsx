import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyOrders, getMyCustomOrders, createCustomRazorpayOrder, verifyCustomRazorpayPayment } from '../api';
import { Package, Ruler, CreditCard, Clock, Image as ImageIcon } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Reviewing', color: 'bg-yellow-100 text-yellow-700', icon: 'schedule' },
  approved: { label: 'Approved (Awaiting Payment)', color: 'bg-blue-100 text-blue-700', icon: 'gavel' },
  paid: { label: 'Paid & Processing', color: 'bg-green-100 text-green-700', icon: 'check_circle' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: 'cancel' }
};

const Orders = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo') || 'null');
  
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Checkout state
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    
    const fetchAll = async () => {
      try {
        const [regOrders, custOrders] = await Promise.all([
          getMyOrders(),
          getMyCustomOrders()
        ]);
        setOrders(regOrders);
        setCustomOrders(custOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleCustomPayment = async (orderId) => {
    try {
      setPaymentLoading(true);
      const orderData = await createCustomRazorpayOrder(orderId);

      // Fallback for mocked backend test orders
      if (orderData.razorpayOrderId.startsWith('order_mock_')) {
        alert("Running in Mock Mode. Payment verified automatically.");
        await verifyCustomRazorpayPayment(orderId, {
           razorpayOrderId: orderData.razorpayOrderId,
           razorpayPaymentId: `pay_mock_${Date.now()}`,
           razorpaySignature: 'mock_signature'
        });
        window.location.reload();
        return;
      }

      // Real Razorpay integration
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AMP3DWorld',
        description: 'Custom Miniature Order',
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            await verifyCustomRazorpayPayment(orderId, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            window.location.reload();
          } catch (err) {
            alert('Verification failed: ' + err.message);
          }
        },
        prefill: { email: user.email },
        theme: { color: '#800000' },
        modal: { ondismiss: () => setPaymentLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (r) => {
        alert(`Payment failed: ${r.error.description}`);
        setPaymentLoading(false);
      });
      rzp.open();

    } catch (err) {
      alert('Failed to initiate payment: ' + err.message);
      setPaymentLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef3e2 0%, #fff8f0 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">My Orders</h1>
            <p className="text-slate-500 mt-1">Track and manage your AMP3DWorld orders and custom requests</p>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-base">add_shopping_cart</span>
            Shop Standard
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4" style={{ borderWidth: '3px' }} />
            <p className="text-slate-400">Loading your history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-red-300 mb-3">error_outline</span>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Custom Orders Section */}
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                 <Ruler size={24} className="text-primary"/> Custom Design Requests
              </h2>
              {customOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                  <p className="text-slate-400 mb-4">No custom requests yet.</p>
                  <Link to="/custom" className="text-primary font-bold hover:underline">Submit a Custom Design</Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {customOrders.map(co => {
                     const status = statusConfig[co.status] || statusConfig.pending;
                     const date = new Date(co.createdAt).toLocaleDateString();
                     
                     return (
                        <div key={co._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                          <div className="w-full sm:w-48 h-48 bg-slate-100 flex items-center justify-center shrink-0">
                            {co.referenceImage ? (
                               <img src={co.referenceImage} alt="Reference" className="w-full h-full object-cover opacity-90"/>
                            ) : (
                               <ImageIcon size={40} className="text-slate-300"/>
                            )}
                          </div>
                          
                          <div className="flex-1 p-6 relative">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.color} mb-3`}>
                              <span className="material-symbols-outlined text-sm">{status.icon}</span>
                              {status.label}
                            </span>
                            
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Custom Submittal #{co._id.slice(-6).toUpperCase()}</h3>
                            <div className="flex gap-4 text-sm text-slate-500 mb-4">
                               <span><Clock size={14} className="inline mr-1"/>{date}</span>
                               <span><Package size={14} className="inline mr-1"/>{co.height}" {co.material.split(" ")[0]}</span>
                            </div>

                            {co.adminNotes && (
                               <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg border border-blue-100 mb-4">
                                  <strong>Admin Note:</strong> {co.adminNotes}
                               </div>
                            )}

                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                               <div>
                                  <p className="text-xs text-slate-400 font-medium">Pricing</p>
                                  {co.finalPrice ? (
                                     <p className="text-xl font-bold text-slate-800">₹{co.finalPrice.toLocaleString('en-IN')}</p>
                                  ) : (
                                     <p className="text-sm font-semibold text-slate-500">Est. ₹{co.estimatedPrice?.toLocaleString('en-IN')}</p>
                                  )}
                               </div>
                               
                               {co.status === 'approved' && (
                                  <button
                                     onClick={() => handleCustomPayment(co._id)}
                                     disabled={paymentLoading}
                                     className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                                  >
                                     <CreditCard size={18}/> {paymentLoading ? "Processing..." : "Pay Now"}
                                  </button>
                               )}
                            </div>
                          </div>
                        </div>
                     );
                  })}
                </div>
              )}
            </div>

            {/* Standard Orders Section */}
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                 <Package size={24} className="text-primary"/> Standard Shop Orders
              </h2>
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400">
                  No standard shop purchases.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => {
                    const status = order.paymentStatus === 'paid' ? statusConfig.paid : order.paymentStatus === 'failed' ? statusConfig.failed : statusConfig.pending;
                    const date = new Date(order.createdAt).toLocaleDateString();
                    return (
                      <div key={order._id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-slate-100">
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Order ID: {order._id.slice(-8).toUpperCase()}</p>
                            <p className="font-semibold text-slate-700 text-sm">{date}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${status.color} mb-1`}>
                              {status.label}
                            </span>
                            <p className="text-lg font-bold text-secondary text-right mt-1">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="px-6 py-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 mb-2 last:mb-0">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                                <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
