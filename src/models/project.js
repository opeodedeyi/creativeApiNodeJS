const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isShowcase: {
        type: Boolean,
        required: false,
        default: false
    },
    isCollab: {
        type: Boolean,
        required: false,
        default: false
    },
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

    // image related start
    thumbnail: {
        type: String,
        required: true,
        trim: true
    },
    media: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        required: false,
    }],
    // image related end


    //  Extras

    //  Skills needed is set by the owner and he specifies the skills that are needed if they
    //  are looking for creatives to join in the project. if projectType is "collaboration" or "both"
    skillsNeeded: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Skill'
    }],
    //  Contributors will be added by the owner, and he adds users that contributed to the project
    contributors: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User'
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Skill'
        },
        required: false,
    }],
    //  If the type of project is a collaboration or both, the below "isOpen if set to true will allow
    //  Other users show interest in a project
    isOpen: {
        type: Boolean,
        required: false,
        default: false
    },
    interest: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }]
}, {
    timestamps: true
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
