const { DataTypes } = require("sequelize")
const { sequelize } = require("./sequelize")

const Jugador = sequelize.define(
  "Jugador",
  {
    id_jugador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  { tableName: "jugador", timestamps: false }
)

const Puntaje = sequelize.define(
  "Puntaje",
  {
    id_puntaje: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    puntaje: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_jugador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Jugador,
        key: "id_jugador"
      }
    }
  },
  { tableName: "puntaje", timestamps: false }
)

const Partida = sequelize.define(
  "Partida",
  {
    id_partida: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    puntaje: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_juego: {
      type: DataTypes.DATE,
      allowNull: false
    },
    jugador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Jugador,
        key: "id_jugador"
      }
    },
    puntaje_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Puntaje,
        key: "id_puntaje"
      }
    }
  },
  { tableName: "partida", timestamps: false }
)

Puntaje.belongsTo(Jugador, { foreignKey: "id_jugador" })

module.exports = { Jugador, Puntaje, Partida }
