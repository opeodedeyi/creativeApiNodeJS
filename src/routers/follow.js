const express = require('express')
const Follow = require('../models/follow')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { request } = require('express')
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
router.get('/api/:id/followers', async (req, res) => {
    try {
        const followers = await Follow.find({
            user: req.params.id
        })

        let followersArr = followers.map(follower=>{
            return follower.followedBy
        })

        const followersCount = followersArr.length

        res.status(200).send({
            "followers": followersArr,
            "followersCount": followersCount
        })
    } catch (e) {
        res.status(500).send()
    }
})


// Get a users following
router.get('/api/:id/following', async (req, res) => {
    try {
        const following = await Follow.find({
            followedBy: req.params.id
        })

        let followingArr = following.map(followin=>{
            return followin.user
        })

        const followingCount = followingArr.length

        res.status(200).send({
            "following": followingArr,
            "followingCount": followingCount
        })
    } catch (e) {
        res.status(500).send()
    }
})


// Get if logged in user is following the user being checked
router.get('/api/:id/isfollowing', auth, async (req, res) => {

    if (req.params.id==req.user._id) {
        return res.status(200).send({ "isfollowing": "Myself" })
    }

    try {
        const amIFollowing = await Follow.find({
            user: req.params.id,
            followedBy: req.user._id
        }).countDocuments()

        if (amIFollowing) {
            return res.status(200).send({ "isfollowing": true })
        }

        return res.status(200).send({ "isfollowing": false })

    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router
