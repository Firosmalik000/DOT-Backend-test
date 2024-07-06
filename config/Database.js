const { Sequelize } = require('sequelize');
const db = new Sequelize('auth_db', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = db;
