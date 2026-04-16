const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.put('/change-password', auth, authController.changePassword);
router.get('/users', auth, adminAuth, authController.getAllUsers);
router.put('/users/:id', auth, adminAuth, authController.updateUser);
router.delete('/users/:id', auth, adminAuth, authController.deleteUser);
router.get('/users/stats', auth, adminAuth, authController.getUserStats);

module.exports = router;
