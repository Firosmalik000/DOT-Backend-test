const express = require('express');
const { Me, login, logout } = require('../controllers/Auth');

const router = express.Router();

router.get('/me', Me);
router.post('/login', login);
router.delete('/logout', logout);

module.exports = router;
