const mongoose = require('mongoose')

const followSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    followedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Showcase'
    },
    status: {
        type: String,
        required: true,
        enum: ["following", "blocked"]
    }
}, {
    timestamps: true
})

const Follow = mongoose.model('Follow', followSchema)

module.exports = Follow
