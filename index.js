const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRouter = require("./routes/user")
const adminRouter = require("./routes/admin")
const authRouter = require("./routes/auth")
const postRouter = require("./routes/post")

dotenv.config()

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p3lfnp2.mongodb.net/mindChatApp`,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to database!")
  })
  .catch(err => {
    console.log("Error connecting to database", err)
  })

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.use("/api/user", userRouter)

app.use("/api/auth", authRouter)

app.use("/api/admin", adminRouter)

app.use("/api/post", postRouter)

app.listen(8800, () => {
  console.log("Backend Server Working Properly")
})
