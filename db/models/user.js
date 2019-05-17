var mongoose = require('mongoose')
var Schema = mongoose.Schema
var mongooseHidden = require('mongoose-hidden')()
var UserSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    local: {
        email: String,
        password: { type: String, hide: true },
        name: String,
        email_verified: { type: Boolean, default: false }
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    refreshToken: [{ type: String }],
    email_verfication_token: String
})

UserSchema.plugin(mongooseHidden)
module.exports = mongoose.model("user", UserSchema)