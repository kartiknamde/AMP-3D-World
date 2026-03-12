import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

const CustomizationModal = ({ isOpen, onClose, product, onConfirm }) => {
  const fileInputRef = useRef(null);
  const [imageBase64, setImageBase64] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [height, setHeight] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!imageBase64) {
      setError('Please upload a reference image for this customized item.');
      return;
    }
    const h = parseFloat(height);
    if (!height || isNaN(h) || h <= 0 || h > 10) {
      setError('Please enter a valid height between 0.1 and 10 inches.');
      return;
    }
    
    onConfirm({
      customImage: imageBase64,
      customHeight: h,
      customNotes: notes
    });

    // Reset after confirm
    setImageBase64('');
    setImagePreview('');
    setHeight('');
    setNotes('');
  };

  const handleClose = () => {
    setImageBase64('');
    setImagePreview('');
    setHeight('');
    setNotes('');
    setError('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-secondary">Customize {product.name}</h3>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm border border-orange-100">
            This item requires a reference photo so our artists can sculpt it accurately.
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Reference Photo <span className="text-red-500">*</span></label>
            <div 
              className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${imagePreview ? 'border-primary/50 bg-primary/5' : 'border-slate-300 hover:border-primary/50 bg-slate-50'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
              />
              
              {imagePreview ? (
                <div className="relative w-full aspect-video flex items-center justify-center">
                  <img src={imagePreview} alt="Reference" className="max-h-full object-contain rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-semibold flex items-center gap-2"><Upload size={18}/> Replace</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary mb-3 shadow-sm border border-slate-100">
                    <Upload size={24} />
                  </div>
                  <p className="text-slate-500 text-sm">Click to upload image</p>
                </>
              )}
            </div>
            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Required Height <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {[6, 8, 10].map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHeight(h)}
                  className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all text-sm ${
                    height === h
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
                  }`}
                >
                  {h}"
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
             <label className="block text-sm font-bold text-slate-700">Special Instructions / Engraving (Optional)</label>
             <textarea 
                className="w-full p-4 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
                rows="3"
                placeholder="E.g., Please add 'Happy Anniversary' on the base."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
             />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
           <button onClick={handleClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">
              Cancel
           </button>
           <button onClick={handleConfirm} className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Confirm & Add to Cart
           </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
