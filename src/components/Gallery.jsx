const Gallery = () => {
  const images = [
    { id: 1, src: '/images/workshop-1.png', alt: 'Painting miniature' },
    { id: 2, src: 'https://images.unsplash.com/photo-1633513192109-29007469a473?auto=format&fit=crop&q=80&w=800', alt: '3D Printer' },
    { id: 3, src: '/images/workshop-2.png', alt: 'Workshop printers' },
    { id: 4, src: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800', alt: 'Finished products' },
    { id: 5, src: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', alt: 'Gift packaging' }
  ];

  return (
    <section className="gallery section">
      <div className="container">
        <div className="gallery-header text-center">
          <h2>Follow The Craft</h2>
          <p>See what's rolling out of our workshop and into homes.</p>
        </div>
        
        <div className="gallery-grid grid">
          {images.map(img => (
            <div key={img.id} className="gallery-item">
              <img src={img.src} alt={img.alt} />
              <div className="gallery-overlay">
                <span>View on Instagram</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .gallery {
          background-color: var(--bg-primary);
        }
        
        .gallery-header h2 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        
        .gallery-header p {
          color: var(--text-muted);
          margin-bottom: 40px;
        }
        
        .gallery-grid {
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
        }
        
        .gallery-item {
          aspect-ratio: 1 / 1;
          border-radius: 15px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
        }
        
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .gallery-item:hover img {
          transform: scale(1.1);
        }
        
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }
        
        @media (max-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 600px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
};

export default Gallery;
