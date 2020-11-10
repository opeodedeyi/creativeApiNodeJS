const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


// Signup a normal user
router.post('/api/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send(e)
    }
})


// Signup an admin user with special previleges
router.post('/api/signupAdmin', async (req, res) => {
    const user = new User({
        ...req.body,
        isEmailConfirmed: true,
        isAdmin: true,
        hasSpecialPrevilege: true
    })

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send(e)
    }
})


// Login a user
router.post('/api/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})


// Log out a user
router.post('/api/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


// Logged Out of all of a user's devices
router.post('/api/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


// Get logged in users profile
router.get('/api/me', auth, async (req, res) => {
    res.send(req.user)
})


// Edit logged in users profile
router.patch('/api/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'password', 'skills', 'bio', 'sex', 'location', 'bodyType', 'height', 'ProfilePhoto']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})


// Edit logged in users profile photo
router.patch('/api/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['ProfilePhoto']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})


// Add a skill or bunch of skills to logged in users profile
router.post('/api/me/skills', auth, async (req, res) => {
    const skillsToAdd = req.body.skill

    try {
        skillsToAdd.forEach((item) => req.user.skills.addToSet(item))
        await req.user.save()
        res.status(201).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})


// remove a skill from logged in users profile
router.delete('/api/me/skills', auth, async (req, res) => {
    const skillsToRemove = req.body.skill

    try {
        skillsToRemove.forEach((item) => {
            req.user.skills = req.user.skills.filter((objid) => {
                return objid != item
            })
        })
        await req.user.save()
        res.status(201).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})


// Get all users in database
router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})


// Getting a specific user details
router.get('/api/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


// Send confirmation email

module.exports = router
