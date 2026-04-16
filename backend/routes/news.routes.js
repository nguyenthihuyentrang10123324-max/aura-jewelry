const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const { auth, adminAuth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/news/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `news-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file ảnh'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', newsController.getAll);
router.get('/categories', newsController.getCategories);
router.get('/:id', newsController.getById);

router.post('/upload', auth, adminAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có file được tải lên' });
    }
    const url = `/uploads/news/${req.file.filename}`;
    res.json({ success: true, data: { url } });
  } catch (error) {
    console.error('Upload news image error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

router.post('/', auth, adminAuth, newsController.create);
router.put('/:id', auth, adminAuth, newsController.update);
router.delete('/:id', auth, adminAuth, newsController.delete);

module.exports = router;
