const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getOrders);
router.get('/stats', auth, adminAuth, orderController.getStats);
router.get('/revenue', auth, adminAuth, orderController.getRevenueByDate);
router.get('/top-products', auth, adminAuth, orderController.getTopProducts);
router.get('/all', auth, adminAuth, orderController.getAllOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id/status', auth, adminAuth, orderController.updateOrderStatus);
router.put('/:id/payment', auth, adminAuth, orderController.updatePaymentStatus);
router.put('/:id/tracking', auth, adminAuth, orderController.updateTracking);

module.exports = router;
