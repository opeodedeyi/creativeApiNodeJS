const express = require('express')
const Follow = require('../models/follow')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


// Follow a user
router.post('/api/:id/follow', auth, async (req, res) => {
    const follow = new Follow({
        user: req.params.id,
        followedBy: req.user._id
    })

    const userToFollow = await User.findById(req.params.id)

    // prevents a user from following themselves
    if (req.params.id==req.user._id) {
        return res.status(403).send({
            "message": "you cannot follow yourself"
        })
    }

    try {
        const isFollowing = await Follow.find({
            user: req.params.id,
            followedBy: req.user._id
        })

        // this is to prevent duplicate follow
        if (isFollowing != "") {
            return res.status(200).send({
                "message": "you are already following the user"
            }) 
        }

        await follow.save()
        res.status(201).send({
            "message": `${req.user.username} are now following ${userToFollow.username}`
        })
    } catch (e) {
        res.status(500).send(e)
    }
})


// Unfollow a user
router.delete('/api/:id/follow', auth, async (req, res) => {
    const userToUnfollow = await User.findById(req.params.id)

    if (req.params.id==req.user._id) {
        return res.status(403).send({
            "message": "you cannot unfollow yourself"
        })
    }

    try {
        await Follow.findOneAndDelete({
            user: req.params.id,
            followedBy: req.user._id
        })
        res.status(201).send({
            "message": `You have successfully unfollowed ${userToUnfollow.username}`
        })
    } catch (e) {
        res.status(500).send(e)
    }
})


// Get a users followers
// Get a users following

module.exports = router
