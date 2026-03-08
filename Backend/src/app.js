const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

// Routes

// Auth router
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

// using router
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app