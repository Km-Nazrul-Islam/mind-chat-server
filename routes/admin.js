const adminRouter = require("express").Router()
adminRouter.get("/", (req, res) => {
  res.send("Admin Router Working")
})
module.exports = adminRouter
