import familyImg from '../assets/family-figurine.png';
import petImg from '../assets/pet-figurine.png';
import portraitImg from '../assets/portrait-figurine.png';
import heroImg from '../assets/hero-figurine.png';

export const PRODUCTS = [
  {
    id: 1,
    name: "Classic Wedding Couple",
    category: "Couple Miniature",
    material: "PLA",
    price: "₹1,499",
    rating: "5.0",
    image: heroImg,
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Family Portrait Small",
    category: "Couple Miniature",
    material: "PLA",
    price: "₹2,100",
    rating: "4.9",
    image: familyImg,
    badge: null
  },
  {
    id: 3,
    name: "Custom Pet Figurine",
    category: "Pet Miniature",
    material: "PETG",
    price: "₹899",
    rating: "4.8",
    image: petImg,
    badge: null
  },
  {
    id: 4,
    name: "Solo Portrait Figurine",
    category: "Art Miniature",
    material: "High Detail Resin",
    price: "₹1,200",
    rating: "4.9",
    image: portraitImg,
    badge: "Most Realistic"
  },
  {
    id: 5,
    name: "Vighnaharta Ganesha",
    category: "Divine Deity",
    material: "High Detail Resin",
    price: "₹1,999",
    oldPrice: "₹2,499",
    rating: "4.9",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgtZzWkROuQ06j8a6dXMC0LxuMU1UtVqek5GJ7NXCnT7gdwVLCkkhjHhPQq5yn7J0H8B7wzkAqPsFkwgNfylNmZ8ie6ZftlqKO6Dwyq8VlBi6IJllqPaSEeHTzEdT62xxkEMdj8YEfyObgVs8bd156x3vdCRN33agLwTbC95hCoHHuX__Rm3sZ9GEbJg0eKhrBXiYfaAGy0uvy8KJI-hCRvyoxiB2q-jhBCuzgMd6PxdlX9BGZjVbjtNJPTbqe5f1uDAu-gTutGs9p",
    badge: null
  },
  {
    id: 6,
    name: "Nataraja Shiva",
    category: "Divine Deity",
    material: "High Detail Resin",
    price: "₹2,250",
    rating: "5.0",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPnXtVPEqz_SCCnDAh7Z49d4b8bORZ85gjrjmoOTbxq2_spCvYsfgM2kiaaftSsQtnO6xBlXHxf5-pu0IKhV-2VhY4AsKsKM4ZwpQgS4w46yi6WC5byQuqzUV-IMEMtayx21CyJr7vORG9DpGkbyT3am9W3YSJUlOVu-yKfDNefllz2VXZf9x_KurtPiUMVwR9A6hwnIbHot9gm3dkC6GExXZA-EAVy72utnSwBWYJaYOM01-lOsI5pFamZa2ukjx7C1nNiH_DOmMX",
    badge: "Limited"
  },
  {
    id: 7,
    name: "Abstract Art Sculpture",
    category: "Art Miniature",
    material: "ABS",
    price: "₹1,250",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&q=80&w=800",
    badge: "Artist Pick"
  }
];

export const CATEGORIES = ['Divine Deity', 'Couple Miniature', 'Pet Miniature', 'Art Miniature'];
export const HOME_CATEGORIES = ['All', 'Couple', 'Family', 'Pet', 'Art'];
