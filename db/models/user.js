var mongoose = require('mongoose')
var schema = mongoose.Schema({
    first_name: { type: String, required: true },
    middle_name: { type: String },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken:[{type:String}]
})

schema.methods.toJSON = function(){
    var obj = this.toObject()
    delete obj.password
    delete obj.refreshToken
    return obj
}
module.exports= mongoose.model("user", schema)