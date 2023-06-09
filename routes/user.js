const User = require("../models/User")
const userRouter = require("express").Router()
const bcrypt = require("bcrypt")

//UPDATE USER
userRouter.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
      } catch (err) {
        return res.status(500).json(err)
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      })
      res.status(200).json("You account has been updated")
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("You can update only your account")
  }
})
//DELETE USER
userRouter.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.user.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      res.status(200).json("You account has been deleted")
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("You can delete only your account")
  }
})

//GET A USER
userRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, updatedAt, ...others } = user._doc
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
})

//FOLLOW A USER

userRouter.put("/:id/follow", async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } })
        await currentUser.updateOne({ $push: { followings: req.params.id } })
        res.status(200).json("User has been followed")
      } else {
        res.status(403).json("You already follow this user")
      }
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(403).json("you can't follow yourself")
  }
})

//UNFOLLOW A USER
userRouter.put("/:id/unfollow", async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } })
        await currentUser.updateOne({ $pull: { followings: req.params.id } })
        res.status(200).json("User has been unfollowed")
      } else {
        res.status(403).json("You don't follow this user")
      }
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(403).json("you can't unfollow yourself")
  }
})
module.exports = userRouter
