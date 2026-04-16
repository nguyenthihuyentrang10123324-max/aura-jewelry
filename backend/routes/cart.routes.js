const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { auth } = require('../middleware/auth');

router.get('/', auth, cartController.getCart);
router.get('/count', auth, cartController.getCartCount);
router.post('/', auth, cartController.addToCart);
router.put('/:productId', auth, cartController.updateCart);
router.delete('/:productId', auth, cartController.removeFromCart);
router.delete('/', auth, cartController.clearCart);

module.exports = router;
