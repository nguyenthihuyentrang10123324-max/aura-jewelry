const pool = require('../config/database');

const Cart = {
  async getByUser(userId) {
    const [items] = await pool.query(`
      SELECT ci.*, 
        p.name as product_name, 
        p.price as product_price, 
        p.sku as product_sku,
        p.stock as product_stock,
        p.slug as product_slug,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as product_image,
        (SELECT url FROM product_images WHERE product_id = p.id LIMIT 1) as thumbnail,
        pv.name as variant_name,
        pv.sku as variant_sku,
        pv.price_modifier as variant_price_modifier,
        pv.stock as variant_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE ci.user_id = ? AND p.deleted_at IS NULL AND p.is_active = 1
    `, [userId]);

    // Calculate totals
    let subtotal = 0;
    let itemCount = 0;
    
    for (const item of items) {
      const unitPrice = parseFloat(item.product_price) + (parseFloat(item.variant_price_modifier) || 0);
      item.unit_price = unitPrice;
      item.total_price = unitPrice * item.quantity;
      subtotal += item.total_price;
      itemCount += item.quantity;
    }

    return { items, subtotal, itemCount };
  },

  async add(userId, productId, variantId = null, quantity = 1) {
    // Check if item already exists in cart
    const [existing] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND variant_id <=> ?',
      [userId, productId, variantId]
    );

    if (existing.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND variant_id <=> ?',
        [quantity, userId, productId, variantId]
      );
    } else {
      // Check stock
      const product = await pool.query(
        'SELECT stock FROM products WHERE id = ? AND is_active = 1 AND deleted_at IS NULL',
        [productId]
      );

      if (product[0].length === 0) {
        throw new Error('Sản phẩm không tồn tại hoặc không khả dụng');
      }

      if (variantId) {
        const [variant] = await pool.query('SELECT stock FROM product_variants WHERE id = ?', [variantId]);
        if (variant.length > 0 && variant[0].stock < quantity) {
          throw new Error('Số lượng vượt quá tồn kho');
        }
      } else if (product[0][0].stock < quantity) {
        throw new Error('Số lượng vượt quá tồn kho');
      }

      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)',
        [userId, productId, variantId, quantity]
      );
    }

    return this.getByUser(userId);
  },

  async update(userId, productId, variantId = null, quantity) {
    if (quantity <= 0) {
      return this.remove(userId, productId, variantId);
    }

    // Check stock
    const product = await pool.query(
      'SELECT stock FROM products WHERE id = ?',
      [productId]
    );

    if (variantId) {
      const [variant] = await pool.query('SELECT stock FROM product_variants WHERE id = ?', [variantId]);
      if (variant.length > 0 && variant[0].stock < quantity) {
        throw new Error('Số lượng vượt quá tồn kho');
      }
    } else if (product[0].length > 0 && product[0][0].stock < quantity) {
      throw new Error('Số lượng vượt quá tồn kho');
    }

    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ? AND variant_id <=> ?',
      [quantity, userId, productId, variantId]
    );

    return this.getByUser(userId);
  },

  async remove(userId, productId, variantId = null) {
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ? AND variant_id <=> ?',
      [userId, productId, variantId]
    );
    return this.getByUser(userId);
  },

  async clear(userId) {
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    return { items: [], subtotal: 0, itemCount: 0 };
  },

  async getCount(userId) {
    const [[{ count }]] = await pool.query(
      'SELECT SUM(quantity) as count FROM cart_items WHERE user_id = ?',
      [userId]
    );
    return count || 0;
  },

  async getItem(userId, productId, variantId = null) {
    const [items] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND variant_id <=> ?',
      [userId, productId, variantId]
    );
    return items[0] || null;
  }
};

module.exports = Cart;
