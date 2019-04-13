var Business = require('../db/models/businessModel')
var upload = require('../services/aws_image_uploader')

exports.create = function (req, res) {
    var business = new Business({
        name: req.body.name,
        description: req.body.description,
        address:req.body.address,
        coordinates: req.body.coordinates,
        businessHours:req.body.businessHours,
        website:req.body.website,
        phone:req.body.phone,
        images:req.body.images
    })
    business.save(function (err) {
        if (err) return res.json(err)
        res.json({ message: "success", data: business })
    })
}

exports.list = function (req, res) {
    Business.find({}, function(err, data){
        if(err) return res.json(err)
        res.json({message:"success", data: data})
    })
}

exports.update = function (req, res) {
    res.send("updated successfully")
}