const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  material: { type: String },
  price: { type: String, required: true },
  oldPrice: { type: String },
  rating: { type: String, default: "5.0" },
  image: { type: String, required: true },
  badge: { type: String, default: null },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
