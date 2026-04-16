const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', contactController.sendContact);
router.get('/', auth, adminAuth, contactController.getAll);
router.get('/:id', auth, adminAuth, contactController.getById);
router.put('/:id/status', auth, adminAuth, contactController.updateStatus);
router.put('/:id/reply', auth, adminAuth, contactController.reply);
router.delete('/:id', auth, adminAuth, contactController.deleteContact);

module.exports = router;
