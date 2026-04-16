const Contact = require('../models/Contact');

exports.sendContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: 'Gửi liên hệ thành công! Chúng tôi sẽ liên hệ sớm nhất.', data: { contact } });
  } catch (error) {
    console.error('Send contact error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { status, search, page, limit } = req.query;
    const offset = ((parseInt(page) || 1) - 1) * (parseInt(limit) || 50);
    const result = await Contact.getAll({
      status,
      search,
      limit: parseInt(limit) || 50,
      offset,
    });
    res.json({
      success: true,
      data: {
        contacts: result.contacts,
        pagination: {
          total: result.total,
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 50,
        },
      },
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const contact = await Contact.getById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy liên hệ' });
    }
    res.json({ success: true, data: { contact } });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }
    const existing = await Contact.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy liên hệ' });
    }
    await Contact.updateStatus(req.params.id, status);
    res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.reply = async (req, res) => {
  try {
    const { admin_reply } = req.body;
    if (!admin_reply?.trim()) {
      return res.status(400).json({ success: false, message: 'Nội dung phản hồi không được để trống' });
    }
    const existing = await Contact.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy liên hệ' });
    }
    const contact = await Contact.reply(req.params.id, admin_reply);
    res.json({ success: true, message: 'Phản hồi thành công', data: { contact } });
  } catch (error) {
    console.error('Reply contact error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const existing = await Contact.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy liên hệ' });
    }
    await Contact.delete(req.params.id);
    res.json({ success: true, message: 'Xóa liên hệ thành công' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
