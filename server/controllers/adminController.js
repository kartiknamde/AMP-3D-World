const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const CustomOrder = require('../models/CustomOrder');
const User = require('../models/User');
const Product = require('../models/Product');

// 1. Admin Login
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;
  if (email === 'namdekartik4@gmail.com' && password === 'Kartik@123') {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, role: 'admin', email });
  }
  return res.status(401).json({ message: 'Invalid admin credentials' });
};

// 2. Get Stats
exports.getStats = async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const orderCount = orders.length;
    const customOrderCount = await CustomOrder.countDocuments();
    const userCount = await User.countDocuments();
    
    res.json({ totalSales, orderCount, customOrderCount, userCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Get All Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // e.g. "shipped", "delivered"
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.shipmentStatus = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Get Custom Orders
exports.getCustomOrders = async (req, res) => {
  try {
    const customOrders = await CustomOrder.find({}).populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json(customOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. Update Custom Order Status
exports.updateCustomOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await CustomOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Custom order not found' });
    
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 7. Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 8. Add Product
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 9. Get Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
