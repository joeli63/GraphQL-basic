import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

var Schema = mongoose.Schema
var saltRound = 10

const User = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => {
            return mongoose.Types.ObjectId()
        }
    },
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    }
})

User.pre('save', function(next) {
    var user = this

    if (!user.isModified('password')) return next()

    bcrypt.genSalt(saltRound, (error, salt) => {
        if (error) return next(error)

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err)

            user.password = hash
            next()
        })
    })
})

User.methods.comparePassword = function(pw, cb) {
    bcrypt.compare(pw, this.password, function(error, isMatch) {
        if (error) return cb(error)

        cb(null, isMatch)
    })
}

export default mongoose.model('user', User)