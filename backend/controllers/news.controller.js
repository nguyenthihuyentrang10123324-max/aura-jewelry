const News = require('../models/News');

exports.getAll = async (req, res) => {
  try {
    const { category, search, is_featured, is_published, page, limit, show_all } = req.query;
    const offset = ((parseInt(page) || 1) - 1) * (parseInt(limit) || 10);

    const result = await News.getAll({
      category,
      search,
      is_featured: is_featured !== undefined ? (is_featured === 'true' ? 1 : 0) : undefined,
      is_published: is_published !== undefined
        ? (is_published === 'true' ? 1 : 0)
        : (show_all === 'true' ? undefined : 1),
      limit: parseInt(limit) || 10,
      offset,
    });

    res.json({
      success: true,
      data: {
        news: result.news,
        pagination: {
          total: result.total,
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
          hasMore: offset + (parseInt(limit) || 10) < result.total,
        },
      },
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const news = await News.getById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    res.json({ success: true, data: { news } });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.body.title?.trim()) {
      return res.status(400).json({ success: false, message: 'Tiêu đề không được để trống' });
    }
    if (!req.body.slug?.trim()) {
      req.body.slug = req.body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    const news = await News.create(req.body);
    const result = await News.getById(news.id);
    res.status(201).json({ success: true, data: { news: result } });
  } catch (error) {
    console.error('Create news error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Slug đã tồn tại, vui lòng dùng slug khác' });
    }
    res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await News.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    if (req.body.title !== undefined && !req.body.title.trim()) {
      return res.status(400).json({ success: false, message: 'Tiêu đề không được để trống' });
    }
    await News.update(req.params.id, req.body);
    const news = await News.getById(req.params.id);
    res.json({ success: true, data: { news } });
  } catch (error) {
    console.error('Update news error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Slug đã tồn tại, vui lòng dùng slug khác' });
    }
    res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  try {
    const existing = await News.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    await News.delete(req.params.id);
    res.json({ success: true, message: 'Xóa bài viết thành công' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await News.getCategories();
    res.json({ success: true, data: { categories } });
  } catch (error) {
    console.error('Get news categories error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
