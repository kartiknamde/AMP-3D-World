import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronRight, TrendingUp, LogOut, ChevronDown, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts, fetchFeaturedProducts } from '../api';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [popularSuggestions, setPopularSuggestions] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Load user from localStorage and keep in sync after login/logout
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem('userInfo');
      setUserInfo(stored ? JSON.parse(stored) : null);
    };
    syncUser();
    // Same-tab login event (dispatched by auth page after successful login)
    window.addEventListener('userLogin', syncUser);
    // Cross-tab sync
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('userLogin', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  // Load popular suggestions once
  useEffect(() => {
    const loadPopular = async () => {
      try {
        const data = await fetchFeaturedProducts();
        setPopularSuggestions(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    loadPopular();
  }, []);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const data = await fetchProducts({ search: searchQuery.trim() });
          setSuggestions(data.slice(0, 5));
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions(popularSuggestions);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchQuery, popularSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/shop?id=${product._id}`);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner flex">
        {/* LOGO SECTION */}
        <div className="navbar-section section-left">
          <Link to="/" className="logo flex items-center">
            <div className="logo-icon-box flex items-center justify-center">
              <span className="logo-icon">3D</span>
            </div>
            <span className="logo-text">AMP 3D WORLD</span>
          </Link>
        </div>

        {/* LINKS SECTION */}
        <div className="navbar-section section-center">
          <div className="nav-links flex items-center">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/custom" className="nav-link">Custom Design</Link>
            {userInfo && (
              <Link to="/orders" className="nav-link nav-link-orders flex items-center gap-2">
                <Package size={16} />
                My Orders
              </Link>
            )}
          </div>
        </div>

        {/* ACTIONS SECTION */}
        <div className="navbar-section section-right">
          <div className="nav-actions flex items-center">
            <form onSubmit={handleSearch} className="search-bar-container relative" ref={searchRef}>
              <div className={`search-bar flex items-center ${isSearchFocused ? 'focused' : ''}`}>
                <Search className="search-icon" size={18} />
                <input 
                  type="text" 
                  placeholder="Search figurines..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
              </div>
              
              {/* Suggestions Dropdown */}
              {isSearchFocused && (
                <div className="search-suggestions">
                  <div className="suggestion-label flex items-center gap-8">
                    {searchQuery.trim().length > 0 ? (
                       <><Search size={14} /> <span>Search Results</span></>
                    ) : (
                       <><TrendingUp size={14} /> <span>Popular Collections</span></>
                    )}
                  </div>
                  {suggestions.length > 0 ? (
                    suggestions.map((product) => (
                      <div 
                        key={product._id} 
                        className="suggestion-item flex items-center gap-12"
                        onClick={() => handleSuggestionClick(product)}
                      >
                        <div className="suggestion-img">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className="suggestion-info">
                          <span className="suggestion-name">{product.name}</span>
                          <span className="suggestion-cat">{product.category}</span>
                        </div>
                        <ChevronRight className="ml-auto opacity-20" size={16} />
                      </div>
                    ))
                  ) : (
                    <div className="p-15 text-center text-muted-opacity">No results found</div>
                  )}
                  {searchQuery.trim().length > 0 && suggestions.length > 0 && (
                    <div className="suggestion-footer" onClick={handleSearch}>
                      Search for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </form>

            <div className="action-icons flex items-center">
              <div className="cart-icon relative">
                <ShoppingCart size={22} className="cursor-pointer" onClick={() => setIsCartOpen(true)} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>

              {/* Profile / Auth Area */}
              {userInfo ? (
                <div className="profile-area" ref={profileRef}>
                  <button className="profile-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                    <div className="profile-avatar">{userInfo.name.charAt(0).toUpperCase()}</div>
                    <div className="profile-greeting">
                      <span className="namaste-text">Namaste,</span>
                      <span className="username-text">{userInfo.name.split(' ')[0]}</span>
                    </div>
                    <ChevronDown size={14} className={`chevron-icon ${isProfileOpen ? 'rotated' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="profile-dropdown">
                      <div className="profile-dropdown-header">
                        <strong>{userInfo.name}</strong>
                        <span>{userInfo.email}</span>
                      </div>
                      <Link
                        to="/orders"
                        className="dropdown-link"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Package size={15} />
                        My Orders
                      </Link>
                      <button className="signout-btn" onClick={handleSignOut}>
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/auth" className="login-link">
                  <User size={22} />
                  <span>Login</span>
                </Link>
              )}
            </div>
            
            <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          height: 90px;
          background-color: white;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
        }
        
        .navbar-inner {
          width: 100%;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-section {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .section-center {
          justify-content: center;
        }

        .section-right {
          justify-content: flex-end;
        }
        
        .logo-icon-box {
          width: 38px;
          height: 38px;
          background-color: var(--bg-secondary);
          color: white;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.85rem;
          margin-right: 14px;
        }
        
        .logo-text {
          font-family: var(--font-headings);
          font-weight: 700;
          font-size: 1.3rem;
          color: var(--text-dark);
          letter-spacing: 1.5px;
          white-space: nowrap;
        }
        
        .nav-links {
          gap: 35px;
        }

        .nav-link {
          font-weight: 600;
          color: var(--text-dark);
          font-size: 1rem;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .nav-link:hover {
          color: var(--accent-primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent-primary);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-actions {
          gap: 25px;
        }

        .action-icons {
          gap: 20px;
        }

        .search-bar {
          background-color: #f7f7f7;
          padding: 10px 18px;
          border-radius: 25px;
          width: 260px;
          gap: 12px;
          border: 1.5px solid transparent;
          transition: all 0.3s ease;
        }

        .search-bar.focused {
          background-color: white;
          border-color: var(--accent-primary);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          width: 300px; /* Slight expansion on focus */
        }
        
        .search-bar input {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.95rem;
          color: var(--text-dark);
          font-weight: 500;
        }
        
        .search-icon {
          color: #999;
        }

        /* Search Suggestions */
        .search-suggestions {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          right: 0;
          background: white;
          border-radius: 18px;
          box-shadow: 0 15px 50px rgba(0,0,0,0.18);
          overflow: hidden;
          z-index: 1001;
          animation: slideDown 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          width: 320px;
        }

        .suggestion-label {
          padding: 15px 18px 8px;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid #f5f5f5;
        }

        @keyframes slideDown {
          from { transform: translateY(-10px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .suggestion-item {
          padding: 14px 18px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .suggestion-item:hover {
          background-color: #fff9f0; /* Soft amber hover */
        }

        .suggestion-img {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: #f8f8f8;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #eee;
        }

        .suggestion-img img {
          max-height: 100%;
          object-fit: contain;
        }

        .suggestion-info {
           display: flex;
           flex-direction: column;
           gap: 2px;
        }

        .suggestion-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .suggestion-cat {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .suggestion-footer {
          padding: 12px 18px;
          background: #fafafa;
          border-top: 1px solid #eee;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent-primary);
          cursor: pointer;
          text-align: center;
          transition: background 0.2s;
        }

        .suggestion-footer:hover {
          background: #f0f0f0;
        }

        /* Profile Area */
        .profile-area {
          position: relative;
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff9f0;
          border: 1.5px solid #f2930d40;
          border-radius: 50px;
          padding: 5px 14px 5px 5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .profile-btn:hover {
          background: #fff3e0;
          border-color: #f2930d;
          box-shadow: 0 4px 12px rgba(242,147,13,0.15);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          background: #800000;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .profile-greeting {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .namaste-text {
          font-size: 0.65rem;
          color: #f2930d;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .username-text {
          font-size: 0.9rem;
          font-weight: 700;
          color: #800000;
        }

        .chevron-icon {
          color: #9ca3af;
          transition: transform 0.2s ease;
        }

        .chevron-icon.rotated {
          transform: rotate(180deg);
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 220px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          border: 1px solid #f5f5f5;
          overflow: hidden;
          animation: slideDown 0.2s ease;
          z-index: 1002;
        }

        .profile-dropdown-header {
          padding: 16px 18px;
          background: linear-gradient(135deg, #fff9f0, #fff3e0);
          border-bottom: 1px solid #f2930d20;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .profile-dropdown-header strong {
          font-size: 0.95rem;
          color: #800000;
        }

        .profile-dropdown-header span {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .signout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: none;
          border: none;
          color: #ef4444;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
          text-align: left;
        }

        .signout-btn:hover {
          background: #fef2f2;
        }

        .dropdown-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          color: #800000;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: background 0.2s;
          border-bottom: 1px solid #f5f5f5;
        }

        .dropdown-link:hover {
          background: #fff9f0;
        }

        .nav-link-orders {
          color: #800000 !important;
          font-weight: 700;
        }

        .nav-link-orders:hover {
          color: #f2930d !important;
        }

        .login-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-dark);
          font-weight: 600;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .login-link:hover {
          color: var(--accent-primary);
        }

        .cart-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          background-color: var(--accent-primary);
          color: white;
          font-size: 0.7rem;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          border: 2px solid white;
        }
        
        .mobile-toggle {
          display: none;
          cursor: pointer;
          color: var(--text-dark);
        }
        
        @media (max-width: 992px) {
          .section-center, .search-bar-container, .action-icons {
            display: none;
          }
          
          .mobile-toggle {
            display: block;
          }

          .section-right {
            flex: 0;
          }
          
          .mobile-menu {
            position: absolute;
            top: 90px;
            left: 0;
            right: 0;
            background-color: white;
            padding: 30px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            animation: slideDown 0.3s ease-out;
            border-top: 1px solid #f5f5f5;
          }

          .mobile-search-w {
            width: 100%;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }

          .mobile-search-w input {
            flex: 1;
            padding: 12px 15px;
            border: 1px solid #eee;
            border-radius: 10px 0 0 10px;
            outline: none;
          }

          .mobile-search-w button {
             border: 1px solid #eee;
             border-left: none;
             border-radius: 0 10px 10px 0;
             background: #f5f5f5;
             padding: 0 15px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
