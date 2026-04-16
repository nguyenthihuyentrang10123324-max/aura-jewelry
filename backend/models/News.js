const pool = require('../config/database');

const News = {
  async getAll({ category, search, is_featured, is_published = true, limit = 20, offset = 0 }) {
    let query = `
      SELECT id, title, slug, summary, thumbnail, author_name, category, tags, 
             view_count, is_featured, is_published, published_at, created_at
      FROM news
      WHERE deleted_at IS NULL
    `;
    const params = [];

    if (is_published !== undefined) {
      query += ' AND is_published = ?';
      params.push(is_published);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (title LIKE ? OR summary LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (is_featured !== undefined) {
      query += ' AND is_featured = ?';
      params.push(is_featured);
    }

    // Count total
    let countQuery = query.replace(/SELECT id, title, slug,.*?created_at FROM/, 'SELECT COUNT(*) as total FROM');
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    query += ' ORDER BY is_featured DESC, published_at DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);

    // Parse tags JSON
    for (const row of rows) {
      if (row.tags) {
        try { row.tags = JSON.parse(row.tags); } catch { row.tags = []; }
      }
    }

    return { news: rows, total };
  },

  async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM news WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (rows.length === 0) return null;

    if (rows[0].tags) {
      try { rows[0].tags = JSON.parse(rows[0].tags); } catch { rows[0].tags = []; }
    }

    return rows[0];
  },

  async getBySlug(slug) {
    const [rows] = await pool.query(
      'SELECT * FROM news WHERE slug = ? AND deleted_at IS NULL',
      [slug]
    );

    if (rows.length === 0) return null;

    if (rows[0].tags) {
      try { rows[0].tags = JSON.parse(rows[0].tags); } catch { rows[0].tags = []; }
    }

    return rows[0];
  },

  async create(data) {
    const {
      title, slug, summary, content, thumbnail, author_name, category,
      tags, is_featured = false, is_published = true, seo_title, seo_description
    } = data;

    const [result] = await pool.query(
      `INSERT INTO news (title, slug, summary, content, thumbnail, author_name, category, 
        tags, is_featured, is_published, seo_title, seo_description, published_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [title, slug, summary, content, thumbnail, author_name, category,
        tags ? JSON.stringify(tags) : null, is_featured, is_published, seo_title, seo_description,
        is_published ? new Date() : null]
    );
    return { id: result.insertId };
  },

  async update(id, data) {
    const allowedFields = [
      'title', 'slug', 'summary', 'content', 'thumbnail', 'author_name', 'category',
      'tags', 'is_featured', 'is_published', 'seo_title', 'seo_description'
    ];

    const fields = [];
    const params = [];

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (key === 'tags') {
          fields.push('tags = ?');
          params.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = ?`);
          params.push(value);
        }
      }
    }

    // Set published_at if publishing for first time
    if (data.is_published === true) {
      fields.push('published_at = COALESCE(published_at, NOW())');
    }

    if (fields.length > 0) {
      params.push(id);
      await pool.query(`UPDATE news SET ${fields.join(', ')} WHERE id = ?`, params);
    }
  },

  async delete(id) {
    await pool.query('UPDATE news SET deleted_at = NOW() WHERE id = ?', [id]);
  },

  async incrementView(id) {
    await pool.query('UPDATE news SET view_count = view_count + 1 WHERE id = ?', [id]);
  },

  async getCategories() {
    const [rows] = await pool.query(
      'SELECT DISTINCT category FROM news WHERE category IS NOT NULL AND deleted_at IS NULL ORDER BY category'
    );
    return rows.map(r => r.category);
  },

  async getFeatured(limit = 3) {
    const [rows] = await pool.query(`
      SELECT id, title, slug, summary, thumbnail, author_name, category, published_at
      FROM news
      WHERE is_featured = 1 AND is_published = 1 AND deleted_at IS NULL
      ORDER BY published_at DESC
      LIMIT ?
    `, [limit]);
    return rows;
  },

  async getRelated(postId, limit = 3) {
    const post = await this.getById(postId);
    if (!post) return [];

    let query = `
      SELECT id, title, slug, summary, thumbnail, category, published_at
      FROM news
      WHERE id != ? AND is_published = 1 AND deleted_at IS NULL
    `;
    const params = [postId];

    if (post.category) {
      query += ' AND category = ?';
      params.push(post.category);
    }

    query += ' ORDER BY published_at DESC LIMIT ?';
    params.push(limit);

    const [rows] = await pool.query(query, params);
    return rows;
  }
};

module.exports = News;
