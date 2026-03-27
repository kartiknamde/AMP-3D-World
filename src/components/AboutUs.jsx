import React, { useState } from 'react';
const workshopImg = '/images/workshop-1.png';
import { Phone, MessageCircle, Instagram, X } from 'lucide-react';

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="about section" id="about">
      <div className="container grid about-grid">
        <div className="about-visual">
          <div className="image-stack">
            <div className="main-image">
              <img src={workshopImg} alt="Our Artisan Workshop" />
            </div>
            <div className="accent-circle"></div>
          </div>
        </div>
        
        <div className="about-content">
          <span className="section-subtitle">Since 2022</span>
          <h2>Crafting Your World, <br /><span className="text-orange">One Detail at a Time</span></h2>
          <p className="lead">
            At AMP 3D World, we believe that every memory deserves to be held. Our journey began with a simple idea: to bridge the gap between digital precision and human emotion.
          </p>
          <div className="stats-row flex">
            <div className="stat-item">
              <span className="stat-number">5K+</span>
              <span className="stat-label">Minis Crafted</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Happy Clients</span>
            </div>
          </div>
          <p>
            Our team of expert artisans and 3D specialists work tirelessly to ensure that every figurine we produce is not just a model, but a masterpiece. From the initial 3D design to the final hand-painted stroke, quality is our heartbeat.
          </p>
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(true)}>Contact Us</button>
        </div>
      </div>

      {/* Contact Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>
            <div className="modal-header">
              <h3>Connect With Us</h3>
              <p>We're here to bring your miniatures to life. <br />Choose an option to start the conversation.</p>
            </div>
            <div className="contact-options">
              <a href="tel:+910000000000" className="contact-link group">
                <div className="icon-box call">
                  <Phone size={30} />
                </div>
                <span>Call Us</span>
              </a>
              <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer" className="contact-link group">
                <div className="icon-box whatsapp">
                  <MessageCircle size={30} />
                </div>
                <span>WhatsApp</span>
              </a>
              <a href="https://instagram.com/amp3dworld" target="_blank" rel="noopener noreferrer" className="contact-link group">
                <div className="icon-box instagram">
                  <Instagram size={30} />
                </div>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .about {
          background-color: #F9F7F0; /* Cream background consistent with home theme */
          padding: 100px 0;
        }
        
        .about-grid {
          grid-template-columns: 1fr 1.1fr;
          gap: 80px;
          align-items: center;
        }
        
        .section-subtitle {
          color: var(--accent-primary);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.8rem;
          margin-bottom: 15px;
          display: block;
        }
        
        .about-content h2 {
          font-size: 3rem;
          line-height: 1.2;
          margin-bottom: 25px;
          color: var(--text-dark);
        }
        
        .about-content p {
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 25px;
        }
        
        .about-content p.lead {
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--text-dark);
        }
        
        .stats-row {
          gap: 40px;
          margin-bottom: 30px;
          border-top: 1px solid rgba(0,0,0,0.05);
          padding-top: 30px;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
        }
        
        .stat-number {
          font-family: var(--font-headings);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--bg-secondary); /* Burgundy */
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        
        .about-visual {
          position: relative;
        }
        
        .image-stack {
          position: relative;
          z-index: 1;
        }
        
        .main-image {
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
          transform: perspective(1000px) rotateY(-5deg);
        }
        
        .main-image img {
          width: 100%;
          display: block;
        }
        
        .accent-circle {
          position: absolute;
          width: 300px;
          height: 300px;
          background-color: var(--accent-primary);
          border-radius: 50%;
          top: -40px;
          left: -40px;
          z-index: -1;
          opacity: 0.1;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        
        .modal-card {
          background: white;
          width: 100%;
          max-width: 480px;
          padding: 40px;
          border-radius: 30px;
          position: relative;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: modalAppear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        @keyframes modalAppear {
          from { transform: scale(0.8) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        .close-btn {
          position: absolute;
          top: 25px;
          right: 25px;
          background: #f8f8f8;
          border: none;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #999;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-btn:hover {
          background: var(--bg-secondary);
          color: white;
          transform: rotate(90deg);
        }
        
        .modal-header h3 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 12px;
        }
        
        .modal-header p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 40px;
        }
        
        .contact-options {
          display: flex;
          justify-content: center;
          gap: 25px;
        }
        
        .contact-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: transform 0.3s ease;
        }
        
        .contact-link:hover {
          transform: translateY(-8px);
        }
        
        .icon-box {
          width: 72px;
          height: 72px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
        }
        
        .contact-link:hover .icon-box {
          box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }
        
        .icon-box.call { background-color: #4CAF50; }
        .icon-box.whatsapp { background-color: #25D366; }
        .icon-box.instagram { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); }
        
        .contact-link span {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        @media (max-width: 992px) {
          .about-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 50px;
          }
          
          .about-visual {
            order: 2;
          }
          
          .stats-row {
            justify-content: center;
          }
          
          .main-image {
            transform: none;
          }
          
          .accent-circle {
            left: 50%;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
