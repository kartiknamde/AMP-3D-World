import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, Loader2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { login, register } from '../api';

const PasswordRule = ({ valid, text }) => (
  <div className={`flex items-center gap-1.5 text-xs transition-colors ${valid ? 'text-green-600' : 'text-slate-400'}`}>
    {valid ? <CheckCircle size={12} /> : <XCircle size={12} />}
    <span>{text}</span>
  </div>
);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '', phone: '', address: '' });
  };

  // Password requirement checks
  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
  };
  const passwordValid = Object.values(passwordRules).every(Boolean);

  // Phone check
  const phoneValid = /^\d{10}$/.test(formData.phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!isLogin) {
      if (!passwordValid) {
        setError('Please ensure your password meets all the requirements below.');
        return;
      }
      if (!phoneValid) {
        setError('Phone number must be exactly 10 digits.');
        return;
      }
    }

    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await login({ email: formData.email, password: formData.password });
      } else {
        data = await register(formData);
      }
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 text-sm";

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fdf6ec 0%, #fff8f0 50%, #fef3e2 100%)', padding: '48px 24px', position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-body, sans-serif)' }}>

      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '400px', height: '400px', background: 'rgba(242,147,13,0.12)', borderRadius: '50%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: 'rgba(128,0,0,0.08)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <div style={{ maxWidth: '480px', width: '100%', background: 'white', borderRadius: '28px', boxShadow: '0 25px 60px rgba(0,0,0,0.12)', border: '1px solid rgba(242,147,13,0.15)', padding: '40px', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '64px', height: '64px', background: '#800000', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(128,0,0,0.3)' }}>
            <User size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#800000', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {isLogin ? "New to AMP3DWorld?" : "Already have an account?"}{' '}
            <button onClick={switchMode} style={{ color: '#f2930d', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
              {isLogin ? 'Sign up free' : 'Log in'}
            </button>
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <XCircle size={18} color="#ef4444" style={{ marginTop: '1px', flexShrink: 0 }} />
            <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Full Name */}
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              <input
                name="name"
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                style={{ width: '100%', paddingLeft: '44px', paddingRight: '16px', paddingTop: '14px', paddingBottom: '14px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '12px', outline: 'none', fontSize: '0.9rem', color: '#374151', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#f2930d'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
            <input
              name="email"
              type="email"
              required
              placeholder="Gmail / Email Address"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', paddingLeft: '44px', paddingRight: '16px', paddingTop: '14px', paddingBottom: '14px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '12px', outline: 'none', fontSize: '0.9rem', color: '#374151', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#f2930d'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Phone */}
          {!isLogin && (
            <div>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="10-digit Mobile Number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="\d{10}"
                  style={{ width: '100%', paddingLeft: '44px', paddingRight: '16px', paddingTop: '14px', paddingBottom: '14px', background: '#f9fafb', border: `1.5px solid ${formData.phone && !phoneValid ? '#f87171' : '#e5e7eb'}`, borderRadius: '12px', outline: 'none', fontSize: '0.9rem', color: '#374151', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#f2930d'}
                  onBlur={e => e.target.style.borderColor = formData.phone && !phoneValid ? '#f87171' : '#e5e7eb'}
                />
              </div>
              {formData.phone && !phoneValid && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', marginLeft: '4px' }}>Must be exactly 10 digits</p>
              )}
            </div>
          )}

          {/* Address */}
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '16px', color: '#9ca3af', pointerEvents: 'none' }} />
              <textarea
                name="address"
                required
                placeholder="Full Shipping Address (House No, Street, City, State, PIN)"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                style={{ width: '100%', paddingLeft: '44px', paddingRight: '16px', paddingTop: '14px', paddingBottom: '14px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '12px', outline: 'none', fontSize: '0.9rem', color: '#374151', resize: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = '#f2930d'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          )}

          {/* Password */}
          <div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={isLogin ? 'Your password' : 'Min. 8 chars, 1 uppercase, 1 number'}
                value={formData.password}
                onChange={handleChange}
                style={{ width: '100%', paddingLeft: '44px', paddingRight: '48px', paddingTop: '14px', paddingBottom: '14px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '12px', outline: 'none', fontSize: '0.9rem', color: '#374151', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#f2930d'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Rules (only on signup) */}
            {!isLogin && formData.password && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '10px', padding: '12px', background: '#f9fafb', borderRadius: '10px' }}>
                <PasswordRule valid={passwordRules.length} text="Min. 8 characters" />
                <PasswordRule valid={passwordRules.uppercase} text="One uppercase letter" />
                <PasswordRule valid={passwordRules.lowercase} text="One lowercase letter" />
                <PasswordRule valid={passwordRules.number} text="One number" />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', padding: '15px 20px', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s', marginTop: '6px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' 
            }}
          >
            {loading ? (
              <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Please wait...</>
            ) : (
              <>{isLogin ? 'Log In to Account' : 'Create My Account'}<ArrowRight size={20} /></>
            )}
          </button>

        </form>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Auth;
