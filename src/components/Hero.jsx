import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero section">
      <div className="container grid hero-grid">
        <div className="hero-content">
          <div className="badge">Handcrafted with care</div>
          <h1>
            Turn Your <br />
            Memories Into <br />
            <span className="text-orange">3D Miniatures</span>
          </h1>
          <p>
            Unique, hand-painted and highly detailed 3D printed figurines.
            Blending modern technology with artistic precision 
            to capture your moments in solid form.
          </p>
          
          <div className="hero-btns flex">
            <Link to="/custom" className="btn btn-primary">Create Your Miniature</Link>
            <Link to="/shop" className="btn btn-secondary">Browse Products</Link>
          </div>
          
          <div className="ratings flex items-center">
            <div className="stars flex">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#FF6B35" stroke="#FF6B35" />)}
            </div>
            <span>100% Happy Stories</span>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="image-card">
            <img src="/images/hero-figurine.png" alt="3D Wedding Couple Miniature" />
            <div className="floating-badge flex items-center">
              <div className="badge-icon">❤</div>
              <div>
                <strong>1,000+ Happy Stories</strong>
                <span>Real people, real stories</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .hero {
          background-color: var(--bg-primary);
          padding-top: 60px;
          padding-bottom: 100px;
        }
        
        .hero-grid {
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          align-items: center;
        }
        
        .badge {
          display: inline-block;
          background-color: #f1ede4;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: var(--bg-secondary);
        }
        
        .hero-content h1 {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 25px;
          color: var(--text-dark);
        }
        
        .text-orange {
          color: var(--accent-primary);
        }
        
        .hero-content p {
          font-size: 1.1rem;
          color: var(--text-muted);
          max-width: 500px;
          margin-bottom: 40px;
        }
        
        .hero-btns {
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .ratings {
          gap: 15px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .stars {
          gap: 2px;
        }
        
        .hero-visual {
          position: relative;
        }
        
        .image-card {
          background-color: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          transform: rotate(2deg);
        }
        
        .image-card img {
          width: 100%;
          border-radius: 12px;
          display: block;
        }
        
        .floating-badge {
          position: absolute;
          bottom: -20px;
          left: -40px;
          background-color: white;
          padding: 15px 20px;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          transform: rotate(-2deg);
          gap: 15px;
          min-width: 220px;
        }
        
        .badge-icon {
          width: 40px;
          height: 40px;
          background-color: var(--bg-secondary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        
        .floating-badge strong {
          display: block;
          font-size: 0.9rem;
        }
        
        .floating-badge span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .hero-content h1 {
            font-size: 3rem;
          }
          
          .hero-content p {
            margin: 0 auto 40px;
          }
          
          .hero-btns {
            justify-content: center;
          }
          
          .ratings {
            justify-content: center;
          }
          
          .floating-badge {
            left: 0;
            bottom: -30px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
