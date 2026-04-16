const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.getByUser(req.user.id);
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, variant_id, quantity = 1 } = req.body;
    const cart = await Cart.add(req.user.id, product_id, variant_id, quantity);
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(400).json({ success: false, message: error.message || 'Lỗi server' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { quantity, variant_id } = req.body;
    const cart = await Cart.update(req.user.id, req.params.productId, variant_id, quantity);
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(400).json({ success: false, message: error.message || 'Lỗi server' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { variant_id } = req.query;
    const cart = await Cart.remove(req.user.id, req.params.productId, variant_id);
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.clear(req.user.id);
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getCartCount = async (req, res) => {
  try {
    const count = await Cart.getCount(req.user.id);
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
