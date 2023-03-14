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
//Like a post
//Get a post
//Get timeline a post
module.exports = postRouter
