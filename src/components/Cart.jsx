import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQty, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem('userInfo') || 'null');
    if (!user) {
      setIsCartOpen(false);
      navigate('/auth');
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">shopping_bag</span>
            <h2 className="text-xl font-bold text-secondary">Your Cart</h2>
            {cartCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <span className="material-symbols-outlined text-7xl text-slate-200 mb-4">shopping_cart</span>
              <p className="text-slate-400 font-medium text-lg">Your cart is empty</p>
              <p className="text-slate-400 text-sm mt-1">Add some miniatures to get started!</p>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="mt-6 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.cartItemId || item._id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-100 overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                  {item.customizationData && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-white overflow-hidden shadow-md">
                      <img src={item.customizationData.customImage} alt="ref" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-secondary text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.material || item.category}</p>
                  {item.customizationData && (
                    <span className="inline-block mt-1 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">✦ Customized</span>
                  )}
                  {item.customizationData?.customNotes && (
                    <p className="text-[11px] text-slate-500 mt-1 italic truncate">"{item.customizationData.customNotes}"</p>
                  )}
                  <p className="text-primary font-bold text-sm mt-1">
                    ₹{(item.priceNum * item.quantity).toLocaleString('en-IN')}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.cartItemId || item._id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-slate-600 font-bold"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.cartItemId || item._id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-slate-600 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.cartItemId || item._id)}
                  className="self-start p-1.5 hover:bg-red-50 hover:text-red-500 text-slate-300 rounded-lg transition-colors flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-6 py-5 border-t border-slate-100 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
              <span className="text-xl font-bold text-secondary">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-slate-400">Shipping calculated at checkout</p>
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 text-base shadow-lg shadow-secondary/20"
            >
              <span className="material-symbols-outlined">lock</span>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
