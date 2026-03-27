import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center" style={{ marginBottom: '24px', color: 'var(--bg-secondary)' }}>Admin Login</h2>
        {error && <p style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-body)' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-body)' }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  );
}
