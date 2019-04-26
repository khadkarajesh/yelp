var User = require('../db/models/user')
const bcrypt = require('bcrypt')


exports.create = function (req, res) {
    User.find({ email: req.body.email }, function (error, user) {
        if (error) {
            return res.json({ error })
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (error, hash) {
                var newUser = new User({
                    first_name: req.body.first_name,
                    middle_name: req.body.middle_name,
                    last_name: req.body.last_name,
                    email:req.body.email,
                    password: hash
                })
                newUser.save(function (err) {
                    if (err) return res.json(err)
                    res.json({ message: "success", data: newUser })
                })
            })
        })
    })
}