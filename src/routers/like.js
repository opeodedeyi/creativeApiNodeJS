const express = require('express')
const Like = require('../models/like')
const auth = require('../middleware/auth')
const { findOneAndDelete } = require('../models/like')
const router = new express.Router()


// Like a project
router.post('/api/project/:id/like', auth, async (req, res) => {
    const like = new Like({
        user: req.user._id,
        project: req.params.id
    })

    const hasLiked = await Like.findOne({ user: req.user._id, project: req.params.id })

    if (hasLiked) {
        return res.status(400).send({ "message": "you have already liked this post" })
    }

    try {
        await like.save()
        res.status(201).send({ like, "message": `you have successfully liked this project` })
    } catch (e) {
        res.status(500).send(e)
    }
})


// remove like on a project
router.delete('/api/project/:id/like', auth, async (req, res) => {
    try {
        await Like.findOneAndDelete({ user: req.user._id, project: req.params.id })
        res.status(204).send({"message": `you have successfully unliked this project` })
    } catch (e) {
        res.status(400).send(e)
    }
})


// get all likes to a project
router.get('/api/project/:id/like', async (req, res) => {
    try {
        const likes = await Like.find({
            project: req.params.id
        })

        let likersArr = likes.map(like=>{
            return like.user
        })

        const likesCount = likersArr.length

        res.send({
            "likers": likersArr,
            likesCount
        })
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router
