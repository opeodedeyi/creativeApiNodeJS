const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema({
    baseUrl: {
        type: String,
        required: true,
        trim: true
    },
    mediaType: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const Media = mongoose.model('Media', mediaSchema)

module.exports = Media
