const express = require('express')
const Skill = require('../models/skill')
const specialPrevilege = require('../middleware/specialPrevilege')
const router = new express.Router()


// Create a skill
router.post('/api/skill', specialPrevilege, async (req, res) => {
    const skill = new Skill(req.body)

    try {
        await skill.save()
        res.status(201).send({ skill })
    } catch (e) {
        res.status(500).send(e)
    }
})


// Edit a skill
router.patch('/api/skill/:id', specialPrevilege, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true })

        if (!skill) {
            return res.status(404).send()
        }

        res.send(skill)
    } catch (e) {
        res.status(400).send(e)
    }
})


// get all skills
router.get('/api/skill', async (req, res) => {
    try {
        const skill = await Skill.find({})
        res.send(skill)
    } catch (e) {
        res.status(500).send()
    }
})


// get a certain skill
router.get('/api/skill/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const skill = await Skill.findById({ _id })

        if (!skill) {
            return res.status(404).send()
        }

        res.send(skill)
    } catch (e) {
        res.status(500).send()
    }
})


// delete a certain skill
router.delete('/api/skill/:id', specialPrevilege, async (req, res) => {
    const _id = req.params.id

    try {
        await Skill.findByIdAndDelete({ _id })
        res.status(204).send()
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router
