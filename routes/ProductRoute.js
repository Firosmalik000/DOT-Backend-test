const express = require('express');
const { createProducts, deleteProducts, getProducts, getProductsById, updateProducts } = require('../controllers/Products.js');
const { VerivyUser } = require('../middleware/AuthUser.js');

const router = express.Router();

router.get('/products', VerivyUser, getProducts);
router.get('/products/:id', VerivyUser, getProductsById);
router.post('/products', VerivyUser, createProducts);
router.patch('/products/:id', VerivyUser, updateProducts);
router.delete('/products/:id', VerivyUser, deleteProducts);

module.exports = router;
