// models/jugador.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Import Sequelize instance

const User = sequelize.define('jugador', {
  id_jugador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;