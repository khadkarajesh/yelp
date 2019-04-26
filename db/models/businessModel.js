var mongoose = require('mongoose')

var schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
    businessHours: [{
        opening_hour: { type: String, required: true },
        day: { type: String, required: true },
        closing_hour: { type: String, required: true }
    }],
    website: {
        type: String
    },
    categoryId: {
        type: String,
        required: true
    },
    phone: [{
        work_number: {
            type: Number,
        },
        cell_number: {
            type: Number,
        },
        phone_verified: {
            work: Boolean,
            cell: Boolean,
        },
    }],
    images: [{ type: String }]
})
module.exports = mongoose.model("Business", schema)