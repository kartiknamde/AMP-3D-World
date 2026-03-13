import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitCustomOrder } from '../api';
import { Upload, Ruler, Package, Star, AlertCircle } from 'lucide-react';

const LiveCustomizer = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({
    imagePreview: null,
    imageBase64: '',
    height: 5,
    material: 'SLA Resin (High Detail)',
    complexity: 'Medium'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-calculation logic based on requirements
  const calculateEstimate = () => {
    let basePrice = 500; // Base manufacturing setup
    
    // Height factor (e.g. ₹200 per inch)
    const heightCost = form.height * 200;
    
    // Material multiplier
    const materialMultipliers = {
      'PLA (Standard)': 1.0,
      'SLA Resin (High Detail)': 1.5,
      'PETG (Durable)': 1.2,
      'Full Color Sandstone': 2.5
    };
    const matMult = materialMultipliers[form.material] || 1;
    
    // Complexity multiplier
    const complexityMultipliers = {
      'Low': 1.0,
      'Medium': 1.3,
      'High': 1.8
    };
    const compMult = complexityMultipliers[form.complexity] || 1.3;

    return Math.round((basePrice + heightCost) * matMult * compMult);
  };

  const estimatedPrice = calculateEstimate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ 
        ...prev, 
        imagePreview: reader.result,
        imageBase64: reader.result
      }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.imageBase64) {
      setError('Please upload a reference image.');
      return;
    }
    
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    if (!userInfo) {
      navigate('/auth?redirect=/custom');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitCustomOrder({
        referenceImage: form.imageBase64,
        height: Number(form.height),
        material: form.material,
        complexity: form.complexity,
        estimatedPrice
      });
      setSuccess('Your custom request has been submitted! Our team will review the details and provide a final quote soon.');
      // Optional: Redirect to user dashboard after a few seconds
    } catch (err) {
      setError(err.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="customizer section" id="how-it-works">
      <div className="container">
        <div className="customizer-header text-center">
          <span className="subtitle">Bring Your Ideas to Life</span>
          <h2 className="text-white">Request a Custom Design</h2>
          <p className="text-secondary-light">Upload a reference photo, specify your sizing, and we'll handle the 3D modeling and printing.</p>
        </div>
        
        {success ? (
          <div className="bg-white/10 border border-green-500/30 p-10 rounded-2xl text-center max-w-2xl mx-auto">
             <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-white" />
             </div>
             <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
             <p className="text-slate-300">{success}</p>
             <button onClick={() => navigate('/orders')} className="btn btn-primary mt-6">View My Requests</button>
          </div>
        ) : (
          <div className="customizer-layout grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Configuration Form */}
            <div className="options-panel lg:col-span-1">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <Ruler size={20} className="text-primary" /> Specifications
              </h3>

              <div className="space-y-6">
                <div className="option-group">
                  <label>Required Height (Inches)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="1" max="10" step="0.5"
                      value={form.height}
                      onChange={(e) => setForm({...form, height: parseFloat(e.target.value)})}
                      className="w-full accent-primary bg-slate-200 h-2 rounded-lg cursor-pointer"
                    />
                    <span className="font-bold text-lg text-primary w-12 text-center">{form.height}"</span>
                  </div>
                  <small className="block mt-2 text-slate-500">Maximum 10 inches supported for single-piece prints.</small>
                </div>

                <div className="option-group">
                  <label>Material Type</label>
                  <select 
                    value={form.material}
                    onChange={(e) => setForm({...form, material: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option>SLA Resin (High Detail)</option>
                    <option>PLA (Standard)</option>
                    <option>PETG (Durable)</option>
                    <option>Full Color Sandstone</option>
                  </select>
                </div>

                <div className="option-group">
                  <label>Image Complexity</label>
                  <select 
                    value={form.complexity}
                    onChange={(e) => setForm({...form, complexity: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="Low">Low (Simple shapes, single subject)</option>
                    <option value="Medium">Medium (Standard human/pet portrait)</option>
                    <option value="High">High (Multiple subjects, complex scenery)</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Column 2: Image Upload & Preview */}
            <div className="preview-panel lg:col-span-1 flex flex-col h-full">
              <div 
                className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${form.imagePreview ? 'border-primary/50 bg-white/5' : 'border-slate-300 hover:border-primary/50 bg-white/50'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
                
                {form.imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img src={form.imagePreview} alt="Reference" className="max-h-[300px] object-contain rounded-lg shadow-sm" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-semibold flex items-center gap-2"><Upload size={18}/> Replace Image</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <Upload size={28} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">Upload Reference Image</h4>
                    <p className="text-slate-500 text-sm max-w-xs">Upload a clear photo of the person, pet, or object you want 3D printed.</p>
                  </>
                )}
              </div>
            </div>
            
            {/* Column 3: Estimation Summary */}
            <div className="summary-panel lg:col-span-1 h-full flex flex-col">
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                   <Package size={20} className="text-primary" /> Cost Calculation
                </h3>
                
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Base Setup</span>
                    <span>₹500</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Height ({form.height} inches)</span>
                    <span>Based on usage</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Material</span>
                    <span>{form.material.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Complexity</span>
                    <span>{form.complexity}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
                    <p className="text-xs text-orange-800 flex gap-2">
                       <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                       This is a rough estimate. Once submitted, our admins will review your image and send a final approved quote for you to pay.
                    </p>
                  </div>

                  <div className="flex justify-between items-end mb-6">
                    <span className="text-slate-500 font-medium">Estimated Cost</span>
                    <span className="text-3xl font-bold text-primary">₹{estimatedPrice.toLocaleString('en-IN')}</span>
                  </div>

                  {error && (
                    <div className="mb-4 text-red-500 text-sm font-medium text-center">{error}</div>
                  )}
                  
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    Submit for Review
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        .customizer {
          background-color: var(--bg-secondary);
        }
        .subtitle {
          color: var(--accent-primary);
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 2px;
          display: block;
          margin-bottom: 10px;
        }
        .customizer-header {
          margin-bottom: 50px;
        }
        .customizer-header h2 {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }
        .options-panel, .summary-panel {
          background-color: white;
          border-radius: 24px;
          padding: 30px;
          color: var(--text-dark);
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
        }
      `}</style>
    </section>
  );
};

export default LiveCustomizer;
