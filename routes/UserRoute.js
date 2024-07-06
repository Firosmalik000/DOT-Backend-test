const express = require('express');
const { createUsers, getUsers, deleteUsers, getUsersById, updateUsers } = require('../controllers/Users.js');
const { VerivyUser, AdminOnly } = require('../middleware/AuthUser.js');

const router = express.Router();

router.get('/users', VerivyUser, AdminOnly, getUsers);
router.get('/users/:id', VerivyUser, AdminOnly, getUsersById);
router.post('/users', VerivyUser, AdminOnly, createUsers);
router.patch('/users/:id', VerivyUser, AdminOnly, updateUsers);
router.delete('/users/:id', VerivyUser, AdminOnly, deleteUsers);

module.exports = router;
