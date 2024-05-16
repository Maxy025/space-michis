  const http = require("http")
  const url = require("url")
  const { sequelize, testConnection } = require("./sequelize")
  const { Jugador, Puntaje, Partida } = require("./models")

  // Function to get top scores
  const getTopScores = async (topNum) => {
    try {
      const topScores = await Puntaje.findAll({
        order: [["puntaje", "DESC"]],
        limit: Number(topNum),
        include: [{ model: Jugador }]
      })
      return topScores
    } catch (errhandleMatchDataor) {
      console.error("Error fetching top scores:", error)
      throw error
    }
  }

  // Function to handle match data creation
  const handleMatchData = async (parsedBody, res) => {
    try {
      let existingPlayer = await Jugador.findOne({
        where: { user: parsedBody.user }
      })

      if (!existingPlayer)
        existingPlayer = await Jugador.create({ user: parsedBody.user })

      let storedScore = await Puntaje.findOne({
        where: { id_jugador: existingPlayer.id_jugador }
      })

      if (!storedScore) {
        storedScore = await Puntaje.create({
          puntaje: parsedBody.score,
          fecha_registro: new Date(),
          id_jugador: existingPlayer.id_jugador
        })
      } else {
        if (storedScore.puntaje < parsedBody.score) {
          storedScore = await Puntaje.update(
            { puntaje: parsedBody.score },
            { where: { id_jugador: existingPlayer.id_jugador } }
          )
        }
      }

      const createdMatchData = await Partida.create({
        puntaje: parsedBody.score,
        fecha_juego: new Date(),
        jugador_id: existingPlayer.id_jugador,
        puntaje_id: storedScore.id_puntaje
      })

      if (createdMatchData) {
        res.writeHead(201, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" })
        res.end(JSON.stringify({ msg: "Match data successfully registered." }))
      } else {
        throw new Error("Error creating match data")
      }
    } catch (error) {
      console.error("Error handling match data:", error)
      throw error
    }
  }

  // Create HTTP server
  const server = http.createServer(async (req, res) => {
    try {
      const reqUrl = url.parse(req.url, true)
      const { pathname, query } = reqUrl

      if (req.method === "OPTIONS") {
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        });
        res.end();
        return;
      }

      if (req.method === "GET" && pathname === "/top-scores") {
        const topNum = query.top
        const scores = await getTopScores(topNum)
        res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" })
        res.end(JSON.stringify({scores: scores}))
      }

      if (req.method === "POST" && pathname === "/match") {
        let body = ""
        req.on("data", (chunk) => {
          body += chunk
        })

        req.on("end", async () => {
          try {
            const parsedBody = JSON.parse(body)
            await handleMatchData(parsedBody, res)
          } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST"  })
            res.end(JSON.stringify({ error: "Invalid JSON" }))
          }
        })
      }
    } catch (error) {
      console.error("Error processing request:", error)
      res.writeHead(500, { "Content-Type": "application/json",  "Access-Control-Allow-Origin": "*"})
      res.end(JSON.stringify({ error: "Internal Server Error" }))
    }
  })

  // Start the server
  const PORT = 3000
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    testConnection()
  })
