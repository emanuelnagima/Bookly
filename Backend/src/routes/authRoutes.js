const express = require('express');
const { login, getMe, logout } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/logout', logout);

module.exports = router;