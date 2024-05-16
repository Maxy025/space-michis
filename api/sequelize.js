const { Sequelize } = require("sequelize")
const config = require("./config")

const sequelize = new Sequelize(config.development)

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log("Connection to database has been established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

module.exports = { sequelize, testConnection }
