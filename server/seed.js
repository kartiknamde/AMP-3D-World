const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: "Classic Wedding Couple",
    category: "Couple Miniature",
    material: "PLA",
    price: "₹1,499",
    rating: "5.0",
    image: "/src/assets/hero-figurine.png",
    badge: "Bestseller",
    isFeatured: true
  },
  {
    name: "Family Portrait Small",
    category: "Couple Miniature",
    material: "PLA",
    price: "₹2,100",
    rating: "4.9",
    image: "/src/assets/family-figurine.png",
    badge: null,
    isFeatured: true
  },
  {
    name: "Custom Pet Figurine",
    category: "Pet Miniature",
    material: "PETG",
    price: "₹899",
    rating: "4.8",
    image: "/src/assets/pet-figurine.png",
    badge: null,
    isFeatured: true
  },
  {
    name: "Solo Portrait Figurine",
    category: "Art Miniature",
    material: "High Detail Resin",
    price: "₹1,200",
    rating: "4.9",
    image: "/src/assets/portrait-figurine.png",
    badge: "Most Realistic",
    isFeatured: true
  },
  {
    name: "Vighnaharta Ganesha",
    category: "Divine Deity",
    material: "High Detail Resin",
    price: "₹1,999",
    oldPrice: "₹2,499",
    rating: "4.9",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgtZzWkROuQ06j8a6dXMC0LxuMU1UtVqek5GJ7NXCnT7gdwVLCkkhjHhPQq5yn7J0H8B7wzkAqPsFkwgNfylNmZ8ie6ZftlqKO6Dwyq8VlBi6IJllqPaSEeHTzEdT62xxkEMdj8YEfyObgVs8bd156x3vdCRN33agLwTbC95hCoHHuX__Rm3sZ9GEbJg0eKhrBXiYfaAGy0uvy8KJI-hCRvyoxiB2q-jhBCuzgMd6PxdlX9BGZjVbjtNJPTbqe5f1uDAu-gTutGs9p",
    badge: null,
    isFeatured: false
  },
  {
    name: "Nataraja Shiva",
    category: "Divine Deity",
    material: "High Detail Resin",
    price: "₹2,250",
    rating: "5.0",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPnXtVPEqz_SCCnDAh7Z49d4b8bORZ85gjrjmoOTbxq2_spCvYsfgM2kiaaftSsQtnO6xBlXHxf5-pu0IKhV-2VhY4AsKsKM4ZwpQgS4w46yi6WC5byQuqzUV-IMEMtayx21CyJr7vORG9DpGkbyT3am9W3YSJUlOVu-yKfDNefllz2VXZf9x_KurtPiUMVwR9A6hwnIbHot9gm3dkC6GExXZA-EAVy72utnSwBWYJaYOM01-lOsI5pFamZa2ukjx7C1nNiH_DOmMX",
    badge: "Limited",
    isFeatured: false
  },
  {
    name: "Abstract Art Sculpture",
    category: "Art Miniature",
    material: "ABS",
    price: "₹1,250",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&q=80&w=800",
    badge: "Artist Pick",
    isFeatured: false
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');
    
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    await Product.insertMany(products);
    console.log('Database seeded successfully');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

seedDB();
