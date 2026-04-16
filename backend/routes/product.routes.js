const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getAll);
router.get('/categories', productController.getCategories);
router.get('/related/:id', productController.getRelated);
router.get('/slug/:slug', productController.getBySlug);
router.get('/:id', productController.getById);

// Admin routes
router.post('/', auth, adminAuth, productController.create);
router.put('/:id', auth, adminAuth, productController.update);
router.delete('/:id', auth, adminAuth, productController.delete);

// Image management
router.post('/upload', auth, adminAuth, upload.single('image'), productController.uploadImage);
router.post('/:productId/images', auth, adminAuth, productController.addImage);
router.put('/images/:imageId', auth, adminAuth, productController.updateImage);
router.delete('/images/:imageId', auth, adminAuth, productController.deleteImage);

// Variant management
router.post('/:productId/variants', auth, adminAuth, productController.addVariant);
router.put('/variants/:variantId', auth, adminAuth, productController.updateVariant);
router.delete('/variants/:variantId', auth, adminAuth, productController.deleteVariant);

module.exports = router;
