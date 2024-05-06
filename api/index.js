const http = require("http")
const url = require("url")
const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.development);

async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log('Connection to database has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

// Sample data
let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
]

// Create HTTP server
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true)

  // Route requests
  if (reqUrl.pathname === "/users" && req.method === "GET") {
    // Return list of users
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(users))
  } else if (reqUrl.pathname === "/users" && req.method === "POST") {
    // Add a new user
    let body = ""
    req.on("data", (chunk) => {
      body += chunk.toString()
    })
    req.on("end", () => {
      const newUser = JSON.parse(body)
      users.push(newUser)
      res.writeHead(201, { "Content-Type": "application/json" })
      res.end(JSON.stringify(newUser))
    })
  } else {
    // Handle not found
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "Not Found" }))
  }
})

// Start the server
const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  testConnection()
})