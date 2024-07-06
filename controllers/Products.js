const Products = require('../models/ProductModel');
const User = require('../models/UserModel');
const { Op } = require('sequelize');

const getProducts = async (req, res) => {
  // operasi trybock ini adalah untuk admin bisa melihat semua product, sedangkan user hanya bisa melihat product miliknya
  try {
    let response;
    if (req.role === 'admin') {
      response = await Products.findAll({
        // attributes adalah apa2 yang ingin di tampilkan di database
        attributes: ['id', 'uuid', 'name', 'price', 'userId'],
        include: [
          {
            // menyertakan user dalam product karna ada relasi user dalam model product
            model: User,
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
    } else {
      response = await Products.findAll({
        where: {
          userId: req.userId,
        },
        attributes: ['id', 'uuid', 'name', 'price', 'userId'],
        include: [
          {
            attributes: ['name', 'email', 'id'],
            model: User,
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getProductsById = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    let response;
    if (req.role === 'admin') {
      response = await Products.findOne({
        attributes: ['id', 'uuid', 'name', 'price', 'userId'],
        where: {
          id: product.id,
        },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
    } else {
      response = await Products.findOne({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
        attributes: ['id', 'uuid', 'name', 'price', 'userId'],
        include: [
          {
            attributes: ['name', 'email', 'id'],
            model: User,
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const createProducts = async (req, res) => {
  const { name, price } = req.body;
  try {
    await Products.create({
      name,
      price,
      userId: req.userId,
    });
    // 201 adalah created
    res.status(201).json({ msg: 'Product Created successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const updateProducts = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    const { name, price } = req.body;
    if (req.role === 'admin') {
      await Products.update(
        {
          name,
          price,
        },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      // 403 forbidden
      if (req.userId !== product.userId) return res.status(403).json({ msg: 'You are not allowed to update this product' });
      await Products.update(
        {
          name,
          price,
        },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: 'Product Updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const deleteProducts = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (req.role === 'admin') {
      await Products.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      // 403 forbidden
      if (req.userId !== product.userId) return res.status(403).json({ msg: 'You are not allowed to delete this product' });
      await Products.destroy({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: 'Product delete successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getProducts,
  getProductsById,
  createProducts,
  updateProducts,
  deleteProducts,
};
