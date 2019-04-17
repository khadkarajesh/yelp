var Category = require('../db/models/categoryModel')

exports.create = function (req, res) {
    var category = new Category({
        name: req.body.name,
        description: req.body.description,
    })
    category.save(function (err) {
        if (err) return res.json(err)
        res.json({ message: "success", data: category })
    })
}

exports.list = function (req, res) {
    Category.find({}, function(err, data){
        if(err) return res.json(err)
        res.json({message:"success", data: data})
    })
}