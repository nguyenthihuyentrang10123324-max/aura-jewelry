const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, address, avatar, role, is_active, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async create({ name, email, password, phone, address, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, address, role, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, email, hashedPassword, phone, address, role]
    );
    return { id: result.insertId, name, email, phone, address, role };
  },

  async update(id, { name, phone, address, avatar, role, is_active }) {
    const fields = [];
    const params = [];

    if (name !== undefined) { fields.push('name = ?'); params.push(name); }
    if (phone !== undefined) { fields.push('phone = ?'); params.push(phone); }
    if (address !== undefined) { fields.push('address = ?'); params.push(address); }
    if (avatar !== undefined) { fields.push('avatar = ?'); params.push(avatar); }
    if (role !== undefined) { fields.push('role = ?'); params.push(role); }
    if (is_active !== undefined) { fields.push('is_active = ?'); params.push(is_active); }

    if (fields.length > 0) {
      params.push(id);
      await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    }
    return this.findById(id);
  },

  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  },

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },

  async getAll({ role, is_active, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE 1=1';
    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }
    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM users');

    return { users: rows, total };
  },

  async getStats() {
    const [[{ total_users }]] = await pool.query('SELECT COUNT(*) as total_users FROM users WHERE role = "user"');
    const [[{ total_admins }]] = await pool.query('SELECT COUNT(*) as total_admins FROM users WHERE role = "admin"');

    return { total_users, total_admins };
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = User;
