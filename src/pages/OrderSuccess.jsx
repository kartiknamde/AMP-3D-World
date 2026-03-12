import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const awbCode = searchParams.get('awb');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!orderId) { navigate('/'); return null; }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'linear-gradient(135deg, #fef3e2 0%, #fff8f0 50%, #fde8cc 100%)' }}>
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7); }
          70% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(80vh) rotate(720deg); opacity: 0; }
        }
        .pop-in { animation: popIn 0.6s cubic-bezier(.36,.07,.19,.97) both; }
        .float-anim { animation: float 3s ease-in-out infinite; }
        .confetti { position: fixed; pointer-events: none; animation: confettiFall 4s ease-in forwards; z-index: 100; }
      `}</style>

      {/* Confetti */}
      {show && ['#f2930d','#800000','#22c55e','#3b82f6','#a855f7','#f59e0b'].map((color, i) => (
        Array.from({ length: 4 }).map((_, j) => (
          <div
            key={`${i}-${j}`}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              width: '8px',
              height: '8px',
              background: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animationDelay: `${Math.random() * 1.5}s`,
              animationDuration: `${2.5 + Math.random() * 2}s`
            }}
          />
        ))
      ))}

      <div className={`max-w-md w-full text-center ${show ? 'pop-in' : 'opacity-0'}`}>
        {/* Success Icon */}
        <div className="float-anim mx-auto w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-6 border-4 border-green-200">
          <span className="material-symbols-outlined text-green-500 text-6xl">check_circle</span>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
          <h1 className="text-3xl font-bold text-secondary mb-2">Order Confirmed! 🎉</h1>
          <p className="text-slate-500 mb-6">Your miniature is being crafted with love. Thank you for your order!</p>

          {/* Order Details */}
          <div className="bg-slate-50 rounded-2xl p-5 space-y-4 text-left mb-6 border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">Order ID</span>
              <span className="text-sm font-bold text-secondary font-mono">{orderId.slice(-8).toUpperCase()}</span>
            </div>
            {awbCode && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-medium">Tracking AWB</span>
                <span className="text-sm font-bold text-primary font-mono">{awbCode}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">Est. Delivery</span>
              <span className="text-sm font-bold text-slate-800">5–7 Business Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">Status</span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                Paid & Processing
              </span>
            </div>
          </div>

          {/* Shiprocket tracking note */}
          {awbCode && (
            <a
              href={`https://shiprocket.co/tracking/${awbCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 mb-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-base">local_shipping</span>
              Track Shipment on Shiprocket
            </a>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/orders"
              className="py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1.5 text-sm"
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              My Orders
            </Link>
            <Link
              to="/shop"
              className="py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 text-sm"
            >
              <span className="material-symbols-outlined text-base">storefront</span>
              Shop More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
