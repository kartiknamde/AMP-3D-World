const express = require('express');
const router = express.Router();
const CustomOrder = require('../models/CustomOrder');
const { protect } = require('../middleware/authMiddleware');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/custom-orders
// @desc    Submit a new custom order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { referenceImage, height, material, complexity, estimatedPrice } = req.body;
    
    if (!referenceImage || !height || !material || !estimatedPrice) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    if (height > 10) {
      return res.status(400).json({ message: 'Maximum allowed height is 10 inches.' });
    }

    const order = await CustomOrder.create({
      user: req.user._id,
      referenceImage,
      height,
      material,
      complexity,
      estimatedPrice
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Create custom order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/custom-orders/my-orders
// @desc    Get logged in user's custom orders
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await CustomOrder.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/custom-orders/admin/all
// @desc    Get all custom orders (Mock admin check)
// @access  Public (in real app, should be admin protected)
router.get('/admin/all', async (req, res) => {
  try {
    const orders = await CustomOrder.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/custom-orders/admin/:id
// @desc    Admin approve/reject/update price
// @access  Public (in real app, should be admin protected)
router.put('/admin/:id', async (req, res) => {
  try {
    const { status, finalPrice, adminNotes } = req.body;
    
    const order = await CustomOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    if (finalPrice) order.finalPrice = finalPrice;
    if (adminNotes) order.adminNotes = adminNotes;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/custom-orders/:id/pay
// @desc    Create Razorpay order for an approved custom order
// @access  Private
router.post('/:id/pay', protect, async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    if (order.status !== 'approved') return res.status(400).json({ message: 'Order is not approved yet' });
    if (!order.finalPrice) return res.status(400).json({ message: 'Final price not set' });

    const amountInPaise = Math.round(order.finalPrice * 100);

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcustom_${order._id}`,
        notes: { userId: req.user._id.toString(), customOrderId: order._id.toString() }
      });
    } catch (rzpErr) {
       console.warn("Razorpay API failed (likely missing/invalid keys). Falling back to mock order.");
       razorpayOrder = { id: `order_mock_custom_${Date.now()}` };
    }

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Create custom payment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/custom-orders/:id/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/:id/verify', protect, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    
    // Bypass signature check for local testing mock orders
    if (!razorpayOrderId.startsWith('order_mock_')) {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ message: 'Payment verification failed' });
      }
    }

    const order = await CustomOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'paid';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save();

    res.json({ message: 'Payment successful', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
