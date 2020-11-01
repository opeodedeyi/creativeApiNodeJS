const mongoose = require('mongoose')

const projectCollabSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    peopleInterested: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    skillsNeeded: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Skill'
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // image related start
    thumbnail: {
        type: String,
        required: true,
        trim: true
    },
    media: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    }],
}, {
    timestamps: true
})

const ProjectCollab = mongoose.model('Showcase', projectCollabSchema)

module.exports = ProjectCollab
