import { Instagram, Facebook, Linkedin, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer section">
      <div className="container grid footer-grid">
        <div className="footer-brand">
          <div className="logo flex items-center mb-20">
            <span className="logo-text">AMP 3D World</span>
          </div>
          <p className="footer-tagline">
            Bringing your most precious memories to life through high-detail, 
            hand-painted 3D printed masterpieces.
          </p>
          <div className="social-links flex mt-30">
            <a href="#" className="social-icon"><Instagram size={20} /></a>
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Linkedin size={20} /></a>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>Help</h4>
          <ul>
            <li><a href="#">Support</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Track Order</a></li>
          </ul>
        </div>
        
        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Process</a></li>
            <li><a href="#">Workshop</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        
        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Subscribe to get special offers and workshop updates.</p>
          <div className="newsletter-form flex mt-20">
            <input type="email" placeholder="Your email address" />
            <button className="btn-send"><Send size={18} /></button>
          </div>
        </div>
      </div>
      
      <div className="container footer-bottom flex justify-between">
        <p>&copy; 2024 AMP 3D World. All rights reserved.</p>
        <div className="payment-icons flex gap-10">
          <span>VISA</span>
          <span>MASTERCARD</span>
        </div>
      </div>
      
      <style>{`
        .footer {
          background-color: var(--bg-secondary);
          color: white;
          padding-bottom: 40px;
        }
        
        .footer-grid {
          grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
          gap: 60px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 60px;
          margin-bottom: 40px;
        }
        
        .logo-text {
          font-family: var(--font-headings);
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--accent-primary);
        }
        
        .footer-tagline {
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
          max-width: 300px;
        }
        
        .social-links {
          gap: 15px;
        }
        
        .social-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(255,255,255,0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }
        
        .social-icon:hover {
          background-color: var(--accent-primary);
        }
        
        .footer-links h4, .footer-newsletter h4 {
          font-size: 1.1rem;
          margin-bottom: 25px;
        }
        
        .footer-links ul {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .footer-links a {
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
          color: var(--accent-primary);
        }
        
        .footer-newsletter p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
        }
        
        .newsletter-form {
          background-color: white;
          border-radius: 8px;
          padding: 5px;
          overflow: hidden;
        }
        
        .newsletter-form input {
          border: none;
          padding: 10px 15px;
          flex: 1;
          outline: none;
          font-family: inherit;
        }
        
        .btn-send {
          background-color: var(--accent-primary);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .footer-bottom {
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
        }
        
        .mb-20 { margin-bottom: 20px; }
        .mt-30 { margin-top: 30px; }
        .gap-20 { gap: 20px; }
        
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }
        
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
