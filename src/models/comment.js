const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    showcase: {
        type: Boolean || mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Showcase' || null,
        default: false
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    reference: {
        type: Boolean || mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Comment' || null,
        default: false
    }
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
