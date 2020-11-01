const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reference: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Showcase'
    }
}, {
    timestamps: true
})

const Like = mongoose.model('Like', likeSchema)

module.exports = Like
