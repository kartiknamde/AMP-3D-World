import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createRazorpayOrder, verifyRazorpayPayment } from '../api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill from user profile
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    pincode: ''
  });

  // Redirect if not logged in or cart is empty
  if (!user) { navigate('/auth'); return null; }
  if (cartItems.length === 0) { navigate('/shop'); return null; }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!form.city || !form.state || !form.pincode) {
      setError('Please fill in all address fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const items = cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        image: item.image,
        price: item.priceNum,
        quantity: item.quantity,
        customImage: item.customizationData?.customImage || null,
        customNotes: item.customizationData?.customNotes || null
      }));

      const orderData = await createRazorpayOrder({ items, shippingAddress: form });

      // If backend fell back to mock mode, bypass real Razorpay UI
      if (orderData.razorpayOrderId.startsWith('order_mock_')) {
         console.warn("Using mock Razorpay flow");
         const verifyRes = await verifyRazorpayPayment({
            orderId: orderData.orderId,
            razorpayOrderId: orderData.razorpayOrderId,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpaySignature: 'mock_signature'
         });
         clearCart();
         navigate(`/order-success?orderId=${orderData.orderId}&awb=${verifyRes.awbCode || ''}`);
         return;
      }

      // Load Razorpay modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AMP3DWorld',
        description: 'Premium 3D Miniatures',
        image: '/favicon.ico',
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await verifyRazorpayPayment({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            clearCart();
            navigate(`/order-success?orderId=${orderData.orderId}&awb=${verifyRes.awbCode || ''}`);
          } catch (err) {
            setError('Payment verified but order update failed. Please contact support.');
          }
        },
        prefill: {
          name: form.name,
          email: user.email,
          contact: form.phone
        },
        theme: { color: '#800000' },
        modal: {
          ondismiss: () => { setLoading(false); }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef3e2 0%, #fde8cc 100%)' }}>
      <style>{`
        .checkout-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          background: white;
          transition: border-color 0.2s;
          outline: none;
        }
        .checkout-input:focus {
          border-color: #f2930d;
          box-shadow: 0 0 0 3px rgba(242, 147, 13, 0.12);
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">Checkout</h1>
          <p className="text-slate-500 mt-1">Review your order and complete payment</p>
        </div>

        <form onSubmit={handlePayment}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left — Address Form */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-secondary mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  Shipping Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange}
                      className="checkout-input" placeholder="Kartik Namde" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      className="checkout-input" placeholder="10-digit mobile number" pattern="\d{10}" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address Line</label>
                    <input name="address" value={form.address} onChange={handleChange}
                      className="checkout-input" placeholder="Flat, Building, Street" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                      <input name="city" value={form.city} onChange={handleChange}
                        className="checkout-input" placeholder="Mumbai" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                      <input name="state" value={form.state} onChange={handleChange}
                        className="checkout-input" placeholder="Maharashtra" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">PIN Code</label>
                    <input name="pincode" value={form.pincode} onChange={handleChange}
                      className="checkout-input" placeholder="400001" pattern="\d{6}" required />
                  </div>
                </div>
              </div>

              {/* Secure badge */}
              <div className="flex items-center gap-3 px-4 py-3 bg-white/70 rounded-xl border border-slate-100">
                <span className="material-symbols-outlined text-green-500">verified_user</span>
                <p className="text-xs text-slate-500">Your payment is secured by Razorpay with 256-bit SSL encryption.</p>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-6">
                <h2 className="text-lg font-bold text-secondary mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  Order Summary
                </h2>

                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.cartItemId || item._id} className="flex gap-3 items-start">
                      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                        {item.customizationData && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-white overflow-hidden shadow">
                            <img src={item.customizationData.customImage} alt="ref" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                        {item.customizationData && (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">✦ Customized</span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-800 flex-shrink-0">
                        ₹{(item.priceNum * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-secondary border-t border-slate-100 pt-3 mt-3">
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2">
                    <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-5 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-base shadow-lg shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Opening Payment...</>
                  ) : (
                    <><span className="material-symbols-outlined">payments</span>Pay ₹{cartTotal.toLocaleString('en-IN')}</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-5 opacity-60" />
                  <span className="text-xs text-slate-400">Powered by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
