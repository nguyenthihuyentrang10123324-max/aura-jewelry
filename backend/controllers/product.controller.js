const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  try {
    const { category, search, sort, order, limit, page, min_price, max_price, is_featured } = req.query;
    const offset = ((parseInt(page) || 1) - 1) * (parseInt(limit) || 20);
    const result = await Product.getAll({ 
      category, search, sort, order, 
      limit: limit || 20, 
      offset,
      min_price,
      max_price,
      is_featured
    });

    res.json({
      success: true,
      data: {
        products: result.products,
        total: result.total,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.offset + result.limit < result.total
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    // Increment view count
    await Product.incrementView(req.params.id);
    res.json({ success: true, data: { product } });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const product = await Product.getBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    await Product.incrementView(product.id);
    res.json({ success: true, data: { product } });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    // Add images if provided
    if (req.body.images && Array.isArray(req.body.images)) {
      for (let i = 0; i < req.body.images.length; i++) {
        const img = req.body.images[i];
        await Product.addImage(product.id, {
          url: typeof img === 'string' ? img : img.url,
          alt_text: img.alt_text || null,
          sort_order: i,
          is_primary: i === 0
        });
      }
    }

    // Add variants if provided
    if (req.body.variants && Array.isArray(req.body.variants)) {
      for (const variant of req.body.variants) {
        await Product.addVariant(product.id, variant);
      }
    }

    const result = await Product.getById(product.id);
    res.status(201).json({ success: true, data: { product: result } });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      const field = error.message.includes('sku') ? 'SKU' : (error.message.includes('barcode') ? 'Barcode' : 'trường duy nhất');
      return res.status(400).json({ success: false, message: `${field} đã được sử dụng cho sản phẩm khác` });
    }
    res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
  }
};

exports.update = async (req, res) => {
  try {
    const productId = req.params.id;
    const existing = await Product.getById(productId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    await Product.update(productId, req.body);

    // Sync images: delete removed, add new
    if (req.body.images && Array.isArray(req.body.images)) {
      const existingIds = (existing.images || []).map(img => img.id);
      const newIds = req.body.images.filter(img => img.id).map(img => img.id);
      for (const imgId of existingIds) {
        if (!newIds.includes(imgId)) await Product.deleteImage(imgId);
      }
      for (let i = 0; i < req.body.images.length; i++) {
        const img = req.body.images[i];
        if (img.id) {
          await Product.updateImage(img.id, { url: img.url, alt_text: img.alt_text, sort_order: i, is_primary: i === 0 });
        } else {
          await Product.addImage(productId, { url: img.url, alt_text: img.alt_text || null, sort_order: i, is_primary: i === 0 });
        }
      }
    }

    // Sync variants: delete removed, update/add new
    if (req.body.variants && Array.isArray(req.body.variants)) {
      const existingVariantIds = (existing.variants || []).map(v => v.id);
      const newVariantIds = req.body.variants.filter(v => v.id).map(v => v.id);
      for (const variantId of existingVariantIds) {
        if (!newVariantIds.includes(variantId)) await Product.deleteVariant(variantId);
      }
      for (const variant of req.body.variants) {
        if (variant.id) {
          await Product.updateVariant(variant.id, variant);
        } else {
          await Product.addVariant(productId, variant);
        }
      }
    }

    const product = await Product.getById(productId);
    res.json({ success: true, data: { product } });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      const field = error.message.includes('sku') ? 'SKU' : (error.message.includes('barcode') ? 'Barcode' : 'trường duy nhất');
      return res.status(400).json({ success: false, message: `${field} đã được sử dụng cho sản phẩm khác` });
    }
    res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.getCategories();
    res.json({ success: true, data: { categories } });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.addImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { url, alt_text, sort_order, is_primary } = req.body;
    const image = await Product.addImage(parseInt(productId), { url, alt_text, sort_order, is_primary });
    res.status(201).json({ success: true, data: { image } });
  } catch (error) {
    console.error('Add image error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.updateImage = async (req, res) => {
  try {
    await Product.updateImage(req.params.imageId, req.body);
    res.json({ success: true, message: 'Cập nhật ảnh thành công' });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    await Product.deleteImage(req.params.imageId);
    res.json({ success: true, message: 'Xóa ảnh thành công' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.addVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    const variant = await Product.addVariant(parseInt(productId), req.body);
    res.status(201).json({ success: true, data: { variant } });
  } catch (error) {
    console.error('Add variant error:', error);
    res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
  }
};

exports.updateVariant = async (req, res) => {
  try {
    await Product.updateVariant(req.params.variantId, req.body);
    res.json({ success: true, message: 'Cập nhật biến thể thành công' });
  } catch (error) {
    console.error('Update variant error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    await Product.deleteVariant(req.params.variantId);
    res.json({ success: true, message: 'Xóa biến thể thành công' });
  } catch (error) {
    console.error('Delete variant error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getRelated = async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await Product.getRelated(req.params.id, parseInt(limit) || 4);
    res.json({ success: true, data: { products } });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có file được tải lên' });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, data: { url } });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
