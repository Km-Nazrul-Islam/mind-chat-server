const sellerRouter = require("express").Router()
sellerRouter.get("/", (req, res) => {
  res.send("Seller Router Working Properly")
})
module.exports = sellerRouter
