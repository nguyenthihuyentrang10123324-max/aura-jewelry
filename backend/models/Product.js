const pool = require('../config/database');

const Product = {
  async getAll({ 
    category, 
    search, 
    sort = 'created_at', 
    order = 'DESC', 
    limit = 20, 
    offset = 0, 
    min_price, 
    max_price,
    is_featured,
    is_active = true
  }) {
    const sortMapping = {
      newest: { column: 'p.created_at', order: 'DESC' },
      oldest: { column: 'p.created_at', order: 'ASC' },
      price_asc: { column: 'p.price', order: 'ASC' },
      price_desc: { column: 'p.price', order: 'DESC' },
      name_asc: { column: 'p.name', order: 'ASC' },
      name_desc: { column: 'p.name', order: 'DESC' },
    };

    let sortColumn = 'p.created_at';
    let sortOrder = 'DESC';

    if (sortMapping[sort]) {
      sortColumn = sortMapping[sort].column;
      sortOrder = sortMapping[sort].order;
    } else {
      sortColumn = `p.${sort}`;
      sortOrder = order || 'DESC';
    }

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT url FROM product_images WHERE product_id = p.id LIMIT 1) as thumbnail
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.deleted_at IS NULL
    `;
    const params = [];

    if (is_active !== undefined) {
      query += ' AND p.is_active = ?';
      params.push(is_active);
    }

    if (category) {
      if (/^\d+$/.test(category)) {
        query += ' AND p.category_id = ?';
      } else {
        query += ' AND (c.slug = ? OR c.name = ?)';
      }
      params.push(category, category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.short_description LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (min_price !== undefined && min_price !== null && min_price > 0) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(min_price));
    }
    if (max_price !== undefined && max_price !== null && max_price < 100000000) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(max_price));
    }

    if (is_featured !== undefined) {
      query += ' AND p.is_featured = ?';
      params.push(is_featured);
    }

    // Count total - viết query riêng thay vì regex replace
    let countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.deleted_at IS NULL
    `;
    const countParams = [];

    if (is_active !== undefined) {
      countQuery += ' AND p.is_active = ?';
      countParams.push(is_active);
    }

    if (category) {
      if (/^\d+$/.test(category)) {
        countQuery += ' AND p.category_id = ?';
      } else {
        countQuery += ' AND (c.slug = ? OR c.name = ?)';
      }
      countParams.push(category, category);
    }

    if (search) {
      countQuery += ' AND (p.name LIKE ? OR p.short_description LIKE ? OR p.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (min_price !== undefined && min_price !== null && min_price > 0) {
      countQuery += ' AND p.price >= ?';
      countParams.push(parseFloat(min_price));
    }
    if (max_price !== undefined && max_price !== null && max_price < 100000000) {
      countQuery += ' AND p.price <= ?';
      countParams.push(parseFloat(max_price));
    }

    if (is_featured !== undefined) {
      countQuery += ' AND p.is_featured = ?';
      countParams.push(is_featured);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    query += ` ORDER BY ${sortColumn} ${sortOrder}`;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);

    return { products: rows, total, limit: parseInt(limit), offset: parseInt(offset) };
  },

  async getById(id) {
    const [products] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.deleted_at IS NULL
    `, [id]);

    if (products.length === 0) return null;

    const [images] = await pool.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order, is_primary DESC',
      [id]
    );
    const [variants] = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = ? AND is_active = 1',
      [id]
    );

    products[0].images = images;
    products[0].variants = variants;

    return products[0];
  },

  async getBySlug(slug) {
    const [products] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.deleted_at IS NULL
    `, [slug]);

    if (products.length === 0) return null;

    const [images] = await pool.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order, is_primary DESC',
      [products[0].id]
    );
    const [variants] = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = ? AND is_active = 1',
      [products[0].id]
    );

    products[0].images = images;
    products[0].variants = variants;

    return products[0];
  },

  async create(data) {
    const {
      name, slug, short_description, description, price, compare_price, cost_price,
      sku, barcode, stock, category_id, material, weight, dimensions,
      is_featured = false, is_active = true, seo_title, seo_description
    } = data;

    const [result] = await pool.query(
      `INSERT INTO products (name, slug, short_description, description, price, compare_price,
        cost_price, sku, barcode, stock, category_id, material, weight, dimensions,
        is_featured, is_active, seo_title, seo_description, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, slug, short_description, description, price, compare_price, cost_price,
        sku || null, barcode || null, stock, category_id, material, weight, dimensions,
        is_featured, is_active, seo_title, seo_description]
    );
    return { id: result.insertId };
  },

  async update(id, data) {
    const allowedFields = [
      'name', 'slug', 'short_description', 'description', 'price', 'compare_price',
      'cost_price', 'sku', 'barcode', 'stock', 'category_id', 'material', 'weight',
      'dimensions', 'is_featured', 'is_active', 'seo_title', 'seo_description'
    ];

    const fields = [];
    const params = [];

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key)) {
        if ((key === 'sku' || key === 'barcode') && value === '') {
          fields.push(`${key} = ?`);
          params.push(null);
        } else if (value !== undefined) {
          fields.push(`${key} = ?`);
          params.push(value);
        }
      }
    }

    if (fields.length > 0) {
      params.push(id);
      await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, params);
    }
    return this.getById(id);
  },

  async delete(id) {
    await pool.query('UPDATE products SET deleted_at = NOW() WHERE id = ?', [id]);
  },

  async hardDelete(id) {
    await pool.query('DELETE FROM product_images WHERE product_id = ?', [id]);
    await pool.query('DELETE FROM product_variants WHERE product_id = ?', [id]);
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
  },

  async addImage(productId, { url, alt_text, sort_order = 0, is_primary = false }) {
    const [result] = await pool.query(
      'INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
      [productId, url, alt_text, sort_order, is_primary]
    );
    return { id: result.insertId };
  },

  async updateImage(imageId, data) {
    const { url, alt_text, sort_order, is_primary } = data;
    const fields = [];
    const params = [];

    if (url !== undefined) { fields.push('url = ?'); params.push(url); }
    if (alt_text !== undefined) { fields.push('alt_text = ?'); params.push(alt_text); }
    if (sort_order !== undefined) { fields.push('sort_order = ?'); params.push(sort_order); }
    if (is_primary !== undefined) {
      if (is_primary) {
        await pool.query('UPDATE product_images SET is_primary = 0 WHERE product_id = (SELECT product_id FROM (SELECT product_id FROM product_images WHERE id = ?) as t)', [imageId]);
      }
      fields.push('is_primary = ?');
      params.push(is_primary);
    }

    if (fields.length > 0) {
      params.push(imageId);
      await pool.query(`UPDATE product_images SET ${fields.join(', ')} WHERE id = ?`, params);
    }
  },

  async deleteImage(imageId) {
    await pool.query('DELETE FROM product_images WHERE id = ?', [imageId]);
  },

  async addVariant(productId, { size, color, sku, stock = 0, price = null, attributes = null }) {
    const name = [size, color].filter(Boolean).join(' - ') || 'Mặc định';
    const attr = attributes || (size || color ? JSON.stringify({ size, color }) : null);
    const variantSku = sku === '' || sku === undefined ? null : sku;
    const [result] = await pool.query(
      'INSERT INTO product_variants (product_id, name, sku, price, stock, attributes) VALUES (?, ?, ?, ?, ?, ?)',
      [productId, name, variantSku, price, stock, attr]
    );
    return { id: result.insertId };
  },

  async getVariantById(variantId) {
    const [variants] = await pool.query('SELECT * FROM product_variants WHERE id = ?', [variantId]);
    return variants[0];
  },

  async updateVariant(variantId, data) {
    const { name, size, color, sku, price_modifier, price, stock, attributes, is_active } = data;
    const fields = [];
    const params = [];

    if (name !== undefined) { fields.push('name = ?'); params.push(name); }
    if (size !== undefined || color !== undefined) {
      const [existing] = await pool.query('SELECT * FROM product_variants WHERE id = ?', [variantId]);
      if (existing.length > 0) {
        const curr = existing[0];
        const parsed = curr.attributes ? JSON.parse(curr.attributes) : {};
        if (size !== undefined) parsed.size = size;
        if (color !== undefined) parsed.color = color;
        const newName = [size !== undefined ? size : parsed.size, color !== undefined ? color : parsed.color].filter(Boolean).join(' - ');
        fields.push('name = ?', 'attributes = ?');
        params.push(newName || curr.name, JSON.stringify(parsed));
      }
    }
    if (sku !== undefined) { fields.push('sku = ?'); params.push(sku === '' ? null : sku); }
    if (price_modifier !== undefined) { fields.push('price_modifier = ?'); params.push(price_modifier); }
    if (price !== undefined) { fields.push('price = ?'); params.push(price); }
    if (stock !== undefined) { fields.push('stock = ?'); params.push(stock); }
    if (attributes !== undefined) { fields.push('attributes = ?'); params.push(JSON.stringify(attributes)); }
    if (is_active !== undefined) { fields.push('is_active = ?'); params.push(is_active); }

    if (fields.length > 0) {
      params.push(variantId);
      await pool.query(`UPDATE product_variants SET ${fields.join(', ')} WHERE id = ?`, params);
    }
  },

  async deleteVariant(variantId) {
    await pool.query('DELETE FROM product_variants WHERE id = ?', [variantId]);
  },

  async getCategories() {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order, name'
    );
    return rows;
  },

  async getRelated(productId, limit = 4) {
    const product = await this.getById(productId);
    if (!product) return [];

    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name,
        (SELECT url FROM product_images WHERE product_id = p.id LIMIT 1) as thumbnail
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1 AND p.deleted_at IS NULL
      ORDER BY RAND()
      LIMIT ?
    `, [product.category_id, productId, limit]);

    return rows;
  },

  async updateStock(productId, quantity) {
    await pool.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, productId]);
  },

  async incrementView(id) {
    await pool.query('UPDATE products SET view_count = view_count + 1 WHERE id = ?', [id]);
  }
};

module.exports = Product;
