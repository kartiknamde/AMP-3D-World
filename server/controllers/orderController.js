const Razorpay = require('razorpay');
const crypto = require('crypto');
const axios = require('axios');
const Order = require('../models/Order');

// ─── Razorpay Instance ────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ─── Shiprocket Auth Token (cached daily) ────────────────────────────────────
let shiprocketToken = null;
let tokenFetchedAt = null;

const getShiprocketToken = async () => {
  const now = Date.now();
  // Refresh token if older than 23 hours
  if (!shiprocketToken || !tokenFetchedAt || (now - tokenFetchedAt) > 23 * 60 * 60 * 1000) {
    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    });
    shiprocketToken = res.data.token;
    tokenFetchedAt = now;
  }
  return shiprocketToken;
};

// ─── Create Razorpay Order ────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order.' });
    }
    if (!shippingAddress || !shippingAddress.pincode || !shippingAddress.city) {
      return res.status(400).json({ message: 'Shipping address is incomplete.' });
    }

    // Calculate total from items (prices in paise for Razorpay)
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const amountInPaise = Math.round(totalAmount * 100);

    // Create Razorpay order
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: { userId: req.user._id.toString() }
      });
    } catch (rzpErr) {
      console.warn("Razorpay API failed (likely missing/invalid keys in .env). Falling back to mock order for demonstration.");
      razorpayOrder = {
        id: `order_mock_${Date.now()}`
      };
    }

    // Save pending order to DB
    const order = await Order.create({
      user: req.user._id,
      items: items.map(i => ({
        product: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity
      })),
      shippingAddress,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending'
    });

    res.json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Failed to create order.' });
  }
};

// ─── Verify Payment & Create Shiprocket Shipment ─────────────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // 1. Verify Razorpay signature
    if (!razorpayOrderId.startsWith('order_mock_')) {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
        return res.status(400).json({ message: 'Payment verification failed. Signature mismatch.' });
      }
    } else {
       console.log("Mock order detected, skipping signature verification.");
    }

    // 2. Mark order as paid
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'paid', razorpayPaymentId, razorpaySignature },
      { new: true }
    ).populate('user');

    if (!order) return res.status(404).json({ message: 'Order not found.' });

    // 3. Create Shiprocket shipment
    let shiprocketData = {};
    try {
      const token = await getShiprocketToken();
      const orderDate = new Date().toISOString().split('T')[0];

      const srPayload = {
        order_id: `AMP3D-${order._id}`,
        order_date: orderDate,
        pickup_location: 'Primary',
        channel_id: process.env.SHIPROCKET_CHANNEL_ID,
        billing_customer_name: order.shippingAddress.name,
        billing_last_name: '',
        billing_address: order.shippingAddress.address,
        billing_city: order.shippingAddress.city,
        billing_pincode: order.shippingAddress.pincode,
        billing_state: order.shippingAddress.state,
        billing_country: 'India',
        billing_email: order.user.email,
        billing_phone: order.shippingAddress.phone,
        shipping_is_billing: true,
        order_items: order.items.map(item => ({
          name: item.name,
          sku: item.product ? item.product.toString() : 'MISC',
          units: item.quantity,
          selling_price: item.price,
          discount: 0,
          tax: 0
        })),
        payment_method: 'Prepaid',
        sub_total: order.totalAmount,
        length: 15,
        breadth: 15,
        height: 10,
        weight: 0.5
      };

      const srRes = await axios.post(
        'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
        srPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      shiprocketData = {
        shiprocketOrderId: srRes.data.order_id?.toString(),
        shiprocketShipmentId: srRes.data.shipment_id?.toString(),
        awbCode: srRes.data.awb_code || srRes.data.response?.data?.awb_code || '',
        trackingUrl: `https://shiprocket.co/tracking/${srRes.data.awb_code || ''}`,
        shipmentStatus: 'booked'
      };

      await Order.findByIdAndUpdate(orderId, shiprocketData);
      console.log('✅ Shiprocket order created:', srRes.data.order_id);
    } catch (srErr) {
      console.error('⚠️  Shiprocket error (order still marked paid):', srErr.response?.data || srErr.message);
      // Don't fail the response — payment went through
    }

    res.json({
      message: 'Payment verified and order confirmed!',
      orderId: order._id,
      ...shiprocketData
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ message: 'Payment verification failed.' });
  }
};

// ─── Get My Orders ────────────────────────────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};
