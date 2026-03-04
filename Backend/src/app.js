const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cookieParser())

// Routes

// Auth router
const authRouter = require("./routes/auth.routes")

// using router
app.use("/api/auth", authRouter)

module.exports = app