const express = require('express')
const Project = require('../models/project')
const auth = require('../middleware/auth')
const { update } = require('../models/project')
const router = new express.Router()


//  Create a showcase project
router.post('/api/showcase', auth, async (req, res) => {
    //  users should only be able to post: 
    //  title, description, images and contributors
    const project = new Project({
        ...req.body,
        owner: req.user._id,
        isShowcase: true,
        isCollab: false,
        isOpen: false
    })

    try {
        await project.save()
        res.status(201).send(project)
    } catch (e) {
        res.status(500).send(e)
    }
})


//  Create a collab project
router.post('/api/collaboration', auth, async (req, res) => {
    //  users should only be able to post: 
    //  title, description, images, skillsNeeded and interest
    const project = new Project({
        ...req.body,
        owner: req.user._id,
        isShowcase: false,
        isCollab: true,
        isOpen: true
    })

    try {
        await project.save()
        res.status(201).send(project)
    } catch (e) {
        res.status(500).send(e)
    }
})


// get all projects
router.get('/api/project', async (req, res) => {
    try {
        const project = await Project.find({})
        res.send(project)
    } catch (e) {
        res.status(500).send()
    }
})


// get all showcase projects
router.get('/api/showcase', async (req, res) => {
    try {
        const project = await Project.find({
            isShowcase: true
        })
        res.send(project)
    } catch (e) {
        res.status(500).send()
    }
})


// get all collaboration projects
router.get('/api/collaboration', async (req, res) => {
    try {
        const project = await Project.find({
            isCollab: true,
            isOpen: true
        })
        res.send(project)
    } catch (e) {
        res.status(500).send()
    }
})


// get a single project
router.get('/api/project/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        res.status(200).send(project)
    } catch (e) {
        res.status(401).send()
    }
})


// get all logged in user's projects
router.get('/api/myprojects', auth, async (req, res) => {
    try {
        const id = req.user._id
        const projects = await Project.find({owner: id})
        res.status(200).send(projects)
    } catch (e) {
        res.status(401).send()
    }
})


// get all of a user's project
router.get('/api/:id/project', async (req, res) => {
    try {
        const projects = await Project.find({owner: req.params.id})
        res.status(200).send(projects)
    } catch (e) {
        res.status(400).send()
    }
})


// Edit a project
router.patch('/api/project/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["isCollab", "description", "thumbnail", "media", "skillsNeeded", "contributors", "isOpen"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates!' })
    }

    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id })

        if (!project) {
            return res.status(404).send()
        }

        updates.forEach((update) => project[update] = req.body[update])
        await project.save()
        res.send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})


// Make a Project (Showcase) a collaboration listing
router.patch('/api/project/:id/makeCollab', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id })

        if (!project) {
            return res.status(404).send()
        }

        project.isCollab=true
        project.isOpen=true
        await project.save()
        res.send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})


// Close a Project from people applying
router.patch('/api/project/:id/close', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id })

        if (!project) {
            return res.status(404).send()
        } else if (project.isCollab==false) {
            return res.status(500).send({"message": "This project needs to be a collaboration before you can do that"})
        }

        project.isOpen=false
        await project.save()
        res.send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})


// open a Project for people to apply
router.patch('/api/project/:id/open', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id })

        if (!project) {
            return res.status(404).send()
        } else if (project.isCollab==false) {
            return res.status(500).send({"message": "This project needs to be a collaboration before you can do that"})
        }

        project.isOpen=true
        await project.save()
        res.status(201).send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})


// delete a project ***(((work on this)))***
router.delete('/api/project/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        await Project.findByIdAndDelete({ _id })
        res.status(204).send()
    } catch (e) {
        res.status(500).send()
    }
})


// apply for collaboration
router.post('/api/project/:id/apply', auth, async (req, res) => {
    try {
        const pro = await Project.findOne({ _id: req.params.id})
        const project = await Project.findOne({ _id: req.params.id, isOpen: true })
        const isOwner = await Project.findOne({ _id: req.params.id, owner:req.user._id })

        if (isOwner) {
            return res.status(400).send({ "message": "you own this project so cannot show interest" })
        }
        else if (pro.isOpen==false) {
            return res.status(400).send({ "message": "this project is closed from any mora application" })
        }
        else if (!project) {
            return res.status(404).send()
        }

        project.interest.addToSet(req.user._id)
        await project.save()
        res.status(200).send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})


// check if user has already shown interest
router.get('/api/project/:id/apply', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id })
        const isOwner = await Project.findOne({ _id: req.params.id, owner:req.user._id })

        if (isOwner) {
            return res.status(400).send({ "message": "you own this project so cannot show interest" })
        }

        var isInArray = project.interest.some(function (int) {
            return int.equals(req.user._id);
        })

        if (!isInArray) {
            return res.status(200).send({ "hasApplied": false })
        }
        
        return res.status(200).send({ "hasApplied": true })
    } catch (e) {
        res.status(400).send(e)
    }
})


// delete an interest on a collaboration
router.delete('/api/project/:id/apply', auth, async (req, res) => {
    const project = await Project.findOne({ _id: req.params.id, isOpen: true })

    if (!project) {
        res.status(500).send({ "message": "you cannot show interest at the moment" })
    }

    try {
        project.interest = project.interest.filter((objid) => {
            return !objid.equals(req.user._id)
        })
        await project.save()
        return res.status(200).send({project})
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router
