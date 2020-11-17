const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
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
    peopleInvolved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    skills: [{
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

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
