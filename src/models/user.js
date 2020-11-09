const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String, 
        required: true,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Passwoed cannot contain "password"')
            }
        }
    },
    dateOfBirth: {
        type: Date,
        required: false,
        trim: true
    },
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Skill'
    }],
    bio: {
        type: String,
        required: false,
        trim: true
    },
    sex: {
        type: String,
        required: false,
        enum: ["male", "female"]
    },
    location: {
        type: String,
        required: false,
        trim: true
    },
    bodyType: {
        type: String,
        required: false,
        enum: ["Slim", "Average", "Athletic", "Heavyset"]
    },
    height: {
        feet: {
            type: Number,
            required: false,
        },
        inch: {
            type: Number,
            required: false,
        },
        required: false,
    },
    // work in progress
    ProfilePhoto: {
        type: String,
        required: false,
        trim: true
    },
    isEmailConfirmed: {
        type: Boolean,
        required: false,
        default: false
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    hasSpecialPrevilege: {
        type: Boolean,
        required: false,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// this generates the token anytime it is called
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'creativetoken')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// prevents the token or password from showing when the 
// user logs in or trying to get their information
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


// handles logging in and checking if the email and password is same
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


// Hash plain text passwords
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
