// models/jugador.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Import Sequelize instance

const Partida = sequelize.define('partida', {
    id_partida: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    puntaje: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    fecha_juego: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    jugador_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id_jugador',
            deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
    },
    puntaje_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Puntaje,
            key: 'id_puntaje',
            deferrable: Deferrable.INITIALLY_IMMEDIATE,
        }
    }
});

module.exports = Partida;