const pool = require('../config/database');

const Contact = {
  async create({ name, email, phone, subject, message }) {
    const [result] = await pool.query(
      'INSERT INTO contacts (name, email, phone, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, "new", NOW())',
      [name, email, phone, subject || null, message]
    );
    return { id: result.insertId };
  },

  async getAll({ status, search, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM contacts WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
      const q = `%${search}%`;
      params.push(q, q, q, q);
    }

    let countQuery = query.replace('SELECT * FROM', 'SELECT COUNT(*) as total FROM');
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    query += ' ORDER BY status ASC, created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    return { contacts: rows, total };
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);
    return this.getById(id);
  },

  async reply(id, admin_reply) {
    await pool.query(
      'UPDATE contacts SET admin_reply = ?, replied_at = NOW(), status = "replied" WHERE id = ?',
      [admin_reply, id]
    );
    return this.getById(id);
  },

  async delete(id) {
    await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
  },

  async getUnreadCount() {
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) as count FROM contacts WHERE status = "new"'
    );
    return count;
  },

  async markAsRead(id) {
    await pool.query('UPDATE contacts SET status = "read" WHERE id = ? AND status = "new"', [id]);
  }
};

module.exports = Contact;
