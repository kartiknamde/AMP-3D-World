import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import CustomOrders from './pages/CustomOrders';
import Users from './pages/Users';
import Products from './pages/Products';
import Sidebar from './components/Sidebar';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  const handleLogin = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app flex" style={{ minHeight: '100vh', display: 'flex' }}>
        <Sidebar onLogout={handleLogout} />
        <main style={{ flex: 1, padding: '32px', backgroundColor: 'var(--bg-primary)', overflowY: 'auto', height: '100vh' }}>
          <Routes>
            <Route path="/" element={<Dashboard token={token} />} />
            <Route path="/orders" element={<Orders token={token} />} />
            <Route path="/custom-orders" element={<CustomOrders token={token} />} />
            <Route path="/users" element={<Users token={token} />} />
            <Route path="/products" element={<Products token={token} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
