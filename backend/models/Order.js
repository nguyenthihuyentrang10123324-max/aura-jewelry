const pool = require('../config/database');
const crypto = require('crypto');

const Order = {
  generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `AURA-${timestamp}-${random}`;
  },

  async create(userId, orderData, items) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const {
        customer_name, customer_email, customer_phone,
        shipping_address, shipping_city, shipping_district, shipping_note,
        subtotal, shipping_fee = 0, discount_amount = 0, discount_code,
        total_price, payment_method = 'cod'
      } = orderData;

      const orderNumber = this.generateOrderNumber();

      const [orderResult] = await connection.query(
        `INSERT INTO orders (order_number, user_id, status, 
          customer_name, customer_email, customer_phone,
          shipping_address, shipping_city, shipping_district, shipping_note,
          subtotal, shipping_fee, discount_amount, discount_code, total_price,
          payment_method, payment_status, created_at)
         VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
        [orderNumber, userId, customer_name, customer_email, customer_phone,
          shipping_address, shipping_city, shipping_district, shipping_note,
          subtotal, shipping_fee, discount_amount, discount_code, total_price, payment_method]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of items) {
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, variant_id, 
            product_name, product_sku, variant_name, image_url,
            unit_price, quantity, total_price)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.variant_id, item.product_name,
            item.product_sku, item.variant_name, item.image_url,
            item.unit_price, item.quantity, item.total_price]
        );

        // Update product stock
        if (item.product_id) {
          await connection.query(
            'UPDATE products SET stock = stock - ? WHERE id = ?',
            [item.quantity, item.product_id]
          );
        }
        // Update variant stock if exists
        if (item.variant_id) {
          await connection.query(
            'UPDATE product_variants SET stock = stock - ? WHERE id = ?',
            [item.quantity, item.variant_id]
          );
        }
      }

      // Clear cart
      await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

      await connection.commit();
      return this.getById(orderId);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async getById(id) {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) return null;

    const [items] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    orders[0].items = items;
    orders[0].item_count = items.reduce((sum, item) => sum + item.quantity, 0);

    return orders[0];
  },

  async getByOrderNumber(orderNumber) {
    const [orders] = await pool.query('SELECT * FROM orders WHERE order_number = ?', [orderNumber]);
    if (orders.length === 0) return null;

    const [items] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orders[0].id]
    );

    orders[0].items = items;
    orders[0].item_count = items.reduce((sum, item) => sum + item.quantity, 0);

    return orders[0];
  },

  async getByUser(userId, { status, limit = 20, offset = 0 } = {}) {
    let query = `
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
      WHERE o.user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await pool.query(query, params);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM orders WHERE user_id = ?', [userId]);

    // Get items for each order
    for (const order of orders) {
      const [items] = await pool.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    return { orders, total };
  },

  async getAll({ status, payment_status, from_date, to_date, search, limit = 50, offset = 0 } = {}) {
    const params = [];
    let conditions = '';

    if (status) {
      conditions += ' AND o.status = ?';
      params.push(status);
    }
    if (payment_status) {
      conditions += ' AND o.payment_status = ?';
      params.push(payment_status);
    }
    if (from_date) {
      conditions += ' AND o.created_at >= ?';
      params.push(from_date);
    }
    if (to_date) {
      conditions += ' AND o.created_at <= ?';
      params.push(to_date);
    }
    if (search) {
      conditions += ' AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_email LIKE ? OR o.customer_phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Count total
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE 1=1${conditions}`,
      params
    );
    const total = countResult[0].total;

    const [orders] = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE 1=1${conditions}
       ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    return { orders, total };
  },

  async updateStatus(id, status, admin_note = null) {
    const updates = ['status = ?'];
    const params = [status];

    if (status === 'shipped') {
      updates.push('shipped_at = NOW()');
    } else if (status === 'delivered') {
      updates.push('delivered_at = NOW()');
    } else if (status === 'cancelled') {
      updates.push('cancelled_at = NOW()');
      // Restore stock
      const [items] = await pool.query('SELECT product_id, variant_id, quantity FROM order_items WHERE order_id = ?', [id]);
      for (const item of items) {
        if (item.product_id) {
          await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
        }
        if (item.variant_id) {
          await pool.query('UPDATE product_variants SET stock = stock + ? WHERE id = ?', [item.quantity, item.variant_id]);
        }
      }
    }

    if (admin_note) {
      updates.push('admin_note = ?');
      params.push(admin_note);
    }

    params.push(id);
    await pool.query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, params);
    return this.getById(id);
  },

  async updatePaymentStatus(id, payment_status, payment_id = null) {
    const updates = ['payment_status = ?'];
    const params = [payment_status];

    if (payment_status === 'paid') {
      updates.push('paid_at = NOW()');
    }
    if (payment_id) {
      updates.push('payment_id = ?');
      params.push(payment_id);
    }

    params.push(id);
    await pool.query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, params);
    return this.getById(id);
  },

  async updateTracking(id, tracking_number) {
    await pool.query(
      'UPDATE orders SET tracking_number = ? WHERE id = ?',
      [tracking_number, id]
    );
    return this.getById(id);
  },

  async updateShippingInfo(id, { shipping_address, shipping_city, shipping_district, shipping_note }) {
    const fields = [];
    const params = [];

    if (shipping_address !== undefined) { fields.push('shipping_address = ?'); params.push(shipping_address); }
    if (shipping_city !== undefined) { fields.push('shipping_city = ?'); params.push(shipping_city); }
    if (shipping_district !== undefined) { fields.push('shipping_district = ?'); params.push(shipping_district); }
    if (shipping_note !== undefined) { fields.push('shipping_note = ?'); params.push(shipping_note); }

    if (fields.length > 0) {
      params.push(id);
      await pool.query(`UPDATE orders SET ${fields.join(', ')} WHERE id = ?`, params);
    }
    return this.getById(id);
  },

  async replyContact(id, admin_reply) {
    await pool.query(
      'UPDATE contacts SET admin_reply = ?, replied_at = NOW(), status = "replied" WHERE id = ?',
      [admin_reply, id]
    );
  },

  async getStats({ from_date, to_date } = {}) {
    let whereClause = '';
    const params = [];

    if (from_date) {
      whereClause += ' AND created_at >= ?';
      params.push(from_date);
    }
    if (to_date) {
      whereClause += ' AND created_at <= ?';
      params.push(to_date);
    }

    const [[orderStats]] = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total_price ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending_orders,
        COALESCE(SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END), 0) as processing_orders,
        COALESCE(SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END), 0) as shipped_orders,
        COALESCE(SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END), 0) as delivered_orders,
        COALESCE(SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END), 0) as cancelled_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total_price ELSE 0 END), 0) as paid_amount
      FROM orders WHERE 1=1 ${whereClause}
    `, params);

    const [[productStats]] = await pool.query(
      'SELECT COUNT(*) as total_products FROM products WHERE is_active = 1 AND deleted_at IS NULL'
    );
    const [[userStats]] = await pool.query(
      'SELECT COUNT(*) as total_users FROM users WHERE role = "user"'
    );

    return {
      total_orders: orderStats.total_orders,
      total_revenue: orderStats.total_revenue,
      paid_amount: orderStats.paid_amount,
      pending_orders: orderStats.pending_orders,
      processing_orders: orderStats.processing_orders,
      shipped_orders: orderStats.shipped_orders,
      delivered_orders: orderStats.delivered_orders,
      cancelled_orders: orderStats.cancelled_orders,
      total_products: productStats.total_products,
      total_users: userStats.total_users
    };
  },

  async getRevenueByDate({ from_date, to_date, group_by = 'day' } = {}) {
    let dateFormat;
    switch (group_by) {
      case 'month':
        dateFormat = '%Y-%m';
        break;
      case 'year':
        dateFormat = '%Y';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    const toDateTime = to_date ? `${to_date} 23:59:59` : '2100-12-31 23:59:59';

    const [stats] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, ?) as date,
        COUNT(*) as orders,
        SUM(total_price) as revenue
      FROM orders
      WHERE status != 'cancelled' AND created_at >= ? AND created_at <= ?
      GROUP BY DATE_FORMAT(created_at, ?)
      ORDER BY date ASC
    `, [dateFormat, from_date, toDateTime, dateFormat]);

    return stats;
  },

  async getTopProducts({ from_date, to_date, limit = 10 } = {}) {
    const [products] = await pool.query(`
      SELECT 
        oi.product_id,
        oi.product_name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled' AND o.created_at >= ? AND o.created_at <= ?
      GROUP BY oi.product_id, oi.product_name
      ORDER BY total_sold DESC
      LIMIT ?
    `, [from_date || '1970-01-01', to_date || '2100-12-31', limit]);

    return products;
  }
};

module.exports = Order;
