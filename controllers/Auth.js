const Users = require('../models/UserModel');
const argon = require('argon2');

const login = async (req, res) => {
  const user = await Users.findOne({
    where: { email: req.body.email },
  });
  if (!user) return res.status(404).json({ msg: 'User not found' });
  const match = await argon.verify(user.password, req.body.password);
  // password pada verivy yang pertama itu ambil dari database, sedangkan yang kedua adalah data yang dikirimkan oleh user
  if (!match) return res.status(400).json({ msg: 'Wrong password' });
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  res.status(200).json({ msg: 'Login success', uuid, name, email, role });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: 'Failed to logout' });
    return res.status(200).json({ msg: 'User logged out' });
  });
};

const Me = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ msg: 'Unauthorized' });
  const user = await Users.findOne({
    attributes: ['uuid', 'name', 'email', 'role'],
    // do cari berdasar uuid karna kita set session sebelumnya di uuid
    where: { uuid: req.session.userId },
  });
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.status(200).json(user);
};

module.exports = {
  login,
  logout,
  Me,
};
