const mongoose = require('mongoose')

const followSchema = new mongoose.Schema({
    // the logged in user who will be trying to follow someone will be added to "followedBy"
    // the user who is getting followed will be added to "user"
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    followedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Showcase'
    }
}, {
    timestamps: true
})

const Follow = mongoose.model('Follow', followSchema)

module.exports = Follow
