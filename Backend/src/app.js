const express = require("express")

const app = express()

app.use(express.json())

// Routes

// Auth router
const authRouter = require("./routes/auth.routes")

// using router
app.use("/api/auth", authRouter)

module.exports = app