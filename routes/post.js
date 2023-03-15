const Post = require("../models/Post")
const postRouter = require("express").Router()
//Create a post
postRouter.post("/", async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save()
    res.status(200).json(savedPost)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Update a post
postRouter.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body })
      res.status(200).json("The post has been updated")
    } else {
      res.status(403).json("You can update only your Post")
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

//Delete a post
postRouter.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.deleteOne()
      res.status(200).json("The post has been deleted")
    } else {
      res.status(403).json("You can delete only your Post")
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

//Like a post
postRouter.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } })
      res.status(200).json("Post has been liked")
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } })
      res.status(200).json("Post has been disliked")
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

//Get a post
postRouter.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Get timeline a post
postRouter.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId)
    const userPost = await Post.find({ userId: currentUser._id })
    const friendPost = await Promise.all(
      currentUser.followings.map(friendId => {
        return Post.find({ userId: friendId })
      })
    )
    res.json(userPost.concat(...friendPost))
  } catch (err) {
    res.status(500).json(err)
  }
})
module.exports = postRouter
