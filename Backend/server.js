require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

app.get("/test", (req, res) => {
    res.send("Server Working")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})