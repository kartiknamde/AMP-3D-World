import { Upload, Settings, Package } from 'lucide-react';

const Steps = () => {
  const steps = [
    {
      id: 1,
      title: '1. Upload Photo',
      desc: 'Simply upload a photo of the person, couple or pet you want to miniaturize.',
      icon: <Upload size={32} />
    },
    {
      id: 2,
      title: '2. Customize Details',
      desc: 'Choose size, theme and adding special notes to make it truly personal.',
      icon: <Settings size={32} />
    },
    {
      id: 3,
      title: '3. Receive Miniature',
      desc: 'We design, 3D print and hand-paint your custom figurine and deliver it safely.',
      icon: <Package size={32} />
    }
  ];

  return (
    <section className="steps section">
      <div className="container">
        <div className="steps-header text-center">
          <h2 className="text-white">Crafted in 3 Simple Steps</h2>
          <p className="text-secondary-light">From your photograph to a premium hand-painted figurine on your desk.</p>
        </div>
        
        <div className="steps-grid grid">
          {steps.map(step => (
            <div key={step.id} className="step-card">
              <div className="step-icon">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .steps {
          background-color: var(--bg-secondary);
          color: white;
        }
        
        .steps-header {
          margin-bottom: 60px;
        }
        
        .steps-header h2 {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }
        
        .text-secondary-light {
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .steps-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        
        .step-card {
          background-color: white;
          padding: 40px 30px;
          border-radius: 20px;
          text-align: center;
          color: var(--text-dark);
          transition: transform 0.3s ease;
        }
        
        .step-card:hover {
          transform: translateY(-10px);
        }
        
        .step-icon {
          width: 70px;
          height: 70px;
          background-color: #fcece8;
          color: var(--accent-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
        }
        
        .step-card h3 {
          font-size: 1.3rem;
          margin-bottom: 15px;
        }
        
        .step-card p {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Steps;
