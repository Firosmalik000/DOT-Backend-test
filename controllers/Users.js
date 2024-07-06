const Users = require('../models/UserModel');
const argon = require('argon2');

const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      // membatasi yang akan ditampilkan di database
      attributes: ['uuid', 'name', 'email', 'role'],
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsersById = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: ['uuid', 'name', 'email', 'role'],
      where: { uuid: req.params.id },
    });
    if (!response) return res.status(404).json({ msg: 'User not found' });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const createUsers = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: 'Password do not match' });
  const hashPassword = await argon.hash(password);
  try {
    await Users.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    res.status(201).json({ msg: 'Register Success' });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
const updateUsers = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const { name, email, password, confPassword, role } = req.body;

    // Validasi data
    if (password !== confPassword) return res.status(400).json({ msg: 'Password and Confirm Password do not match' });

    let hashPassword;
    if (password === '' || password === null || password === undefined) {
      hashPassword = user.password;
    } else {
      hashPassword = await argon.hash(password);
    }

    await Users.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const deleteUsers = async (req, res) => {
  const user = await Users.findOne({
    where: { uuid: req.params.id },
  });
  if (!user) return res.status(404).json({ msg: 'User not found' });
  try {
    await Users.destroy({
      where: { id: user.id },
    });
    res.status(200).json({ msg: 'User Deleted Successfully' });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  getUsers,
  getUsersById,
  createUsers,
  updateUsers,
  deleteUsers,
};
