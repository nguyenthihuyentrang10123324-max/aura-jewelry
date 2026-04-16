const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get cart items
    const cart = await Cart.getByUser(userId);
    if (cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
    }

    const orderData = {
      customer_name: req.body.customer_name || req.user.name,
      customer_email: req.body.customer_email || req.user.email,
      customer_phone: req.body.customer_phone || req.user.phone,
      shipping_address: req.body.shipping_address || req.user.address,
      shipping_city: req.body.shipping_city,
      shipping_district: req.body.shipping_district,
      shipping_note: req.body.shipping_note,
      subtotal: cart.subtotal,
      shipping_fee: req.body.shipping_fee || 0,
      discount_amount: req.body.discount_amount || 0,
      discount_code: req.body.discount_code,
      total_price: cart.subtotal + (req.body.shipping_fee || 0) - (req.body.discount_amount || 0),
      payment_method: req.body.payment_method || 'cod'
    };

    const items = cart.items.map(item => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      variant_name: item.variant_name,
      image_url: item.thumbnail || item.product_image,
      unit_price: item.unit_price,
      quantity: item.quantity,
      total_price: item.total_price
    }));

    const order = await Order.create(userId, orderData, items);
    res.status(201).json({ success: true, data: { order } });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({ success: false, message: error.message || 'Lỗi server' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status, limit, offset } = req.query;
    const result = await Order.getByUser(req.user.id, { status, limit, offset });
    res.json({
      success: true,
      data: {
        orders: result.orders,
        pagination: {
          total: result.total,
          limit: parseInt(limit) || 20,
          offset: parseInt(offset) || 0
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
    }
    res.json({ success: true, data: { order } });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, payment_status, from_date, to_date, search, limit, offset } = req.query;
    const result = await Order.getAll({ status, payment_status, from_date, to_date, search, limit, offset });
    res.json({
      success: true,
      data: {
        orders: result.orders,
        pagination: { total: result.total }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, admin_note } = req.body;
    const order = await Order.updateStatus(req.params.id, status, admin_note);
    res.json({ success: true, data: { order } });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { payment_status, payment_id } = req.body;
    const order = await Order.updatePaymentStatus(req.params.id, payment_status, payment_id);
    res.json({ success: true, data: { order } });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.updateTracking = async (req, res) => {
  try {
    const { tracking_number } = req.body;
    const order = await Order.updateTracking(req.params.id, tracking_number);
    res.json({ success: true, data: { order } });
  } catch (error) {
    console.error('Update tracking error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { from_date, to_date } = req.query;
    const stats = await Order.getStats({ from_date, to_date });
    res.json({ success: true, data: { stats } });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getRevenueByDate = async (req, res) => {
  try {
    const { from_date, to_date, group_by } = req.query;
    const stats = await Order.getRevenueByDate({ from_date, to_date, group_by });
    res.json({ success: true, data: { stats } });
  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const { from_date, to_date, limit } = req.query;
    const products = await Order.getTopProducts({ from_date, to_date, limit });
    res.json({ success: true, data: { products } });
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
