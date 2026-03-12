const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  customImage: { type: String },   // Base64 reference photo from customer
  customNotes: { type: String }    // Special instructions / engraving text
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  totalAmount: { type: Number, required: true },

  // Razorpay
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },

  // Shiprocket
  shiprocketOrderId: { type: String },
  shiprocketShipmentId: { type: String },
  awbCode: { type: String },
  trackingUrl: { type: String },
  shipmentStatus: { type: String, default: 'processing' }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
