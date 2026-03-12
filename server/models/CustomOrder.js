const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referenceImage: { type: String, required: true }, // Base64 or URL
  height: { type: Number, required: true, max: 10, min: 1 }, 
  material: { type: String, required: true },
  complexity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  estimatedPrice: { type: Number, required: true },
  
  // Admin populated fields
  finalPrice: { type: Number },
  adminNotes: { type: String },

  status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },

  // Razorpay fields for when customer pays
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('CustomOrder', customOrderSchema);
