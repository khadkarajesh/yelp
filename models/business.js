var mongoose = require('mongoose')
var schema = mongoose.Schema

var businessSchema = Schema({
  id: {
      type: Number,
      unique: true,
      required: true
  },
  name: {
      type: String,
      required: true
  }
})