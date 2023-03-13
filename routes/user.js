const userRouter = require("express").Router()
userRouter.get("/", (req, res) => {
  res.send("Users Route Working Properly")
})
module.exports = userRouter
