const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

// Public route for admin login
router.post('/login', adminController.adminLogin);

// Protected routes
router.use(adminProtect);
router.get('/stats', adminController.getStats);
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.get('/custom-orders', adminController.getCustomOrders);
router.put('/custom-orders/:id/status', adminController.updateCustomOrderStatus);
router.get('/users', adminController.getUsers);
router.post('/products', adminController.addProduct);
router.get('/products', adminController.getProducts);

module.exports = router;
