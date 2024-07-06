const Users = require('../models/UserModel');

const VerivyUser = async (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ msg: 'Unauthorized' });
  const user = await Users.findOne({
    where: { uuid: req.session.userId },
  });
  if (!user) return res.status(404).json({ msg: 'User not found' });
  req.userId = user.id;
  req.role = user.role;
  next();
};
const AdminOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: { uuid: req.session.userId },
  });
  if (!user) return res.status(404).json({ msg: 'User not found' });
  if (user.role !== 'admin') return res.status(403).json({ msg: 'Access Denied' });
  next();
};

module.exports = { VerivyUser, AdminOnly };
