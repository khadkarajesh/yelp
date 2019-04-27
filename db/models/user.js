var mongoose = require('mongoose')
var schema = mongoose.Schema({
    first_name: { type: String, required: true },
    middle_name: { type: String },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: {
        // type: String, required: true, validate: {
        //     validator: function (v) {
        //         return '/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/'.match(v)
        //     },
        //     message: 'Password must be length of min 6 must contain at least one number and special case'
        // },
        type:String,
        required:[true, 'Password is required']
    },
    refreshToken: [{ type: String }]
})

schema.methods.toJSON = function () {
    var obj = this.toObject()
    delete obj.password
    delete obj.refreshToken
    return obj
}
module.exports = mongoose.model("user", schema)