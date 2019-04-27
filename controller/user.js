var User = require('../db/models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.signup = async function (req, res, next) {
        var user = await User.findOne({ email: req.body.email })
        if (user) return res.status(409).json({ error: { message: "This email is already registered", code: 409 } })
        var salt = await bcrypt.genSalt(10)
        var hash = await bcrypt.hash(req.body.password, salt)
        var newUser = await new User({
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hash
        }).save()
        var accessToken = await jwt.sign({ email: newUser.email }, process.env.APP_SECRET_KEY, { expiresIn: 60 * 60 })
        var refreshToken = await jwt.sign({ email: newUser.email }, process.env.APP_SECRET_KEY, { expiresIn: 24 * 60 * 60 })
        res.json({message: "success", accessToken: accessToken, refreshToken: refreshToken, data: newUser})
}

exports.signin = function (req, res) {
    User.findOne({ email: req.body.username }, function (err, user) {
        if (user) {
            bcrypt.compare(req.body.password, user.password, function (err, match) {
                if (err) res.json(err)
                if (match) {
                    var accessToken = jwt.sign({ email: user.email },
                        process.env.APP_SECRET_KEY,
                        { expiresIn: 60 * 60 })
                    var refreshToken = jwt.sign({ email: user.email },
                        process.env.APP_SECRET_KEY,
                        { expiresIn: 24 * 60 * 60 })
                    user.refreshToken.push(refreshToken)
                    user.save()
                    return res.json({
                        message: "success",
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        data: user
                    })
                }
                res.status(401).send({ error: { code: 401, message: "Invalid username/password" } })
            })
        } else {
            res.status(401).send({ error: { code: 401, message: "Invalid username/password" } })
        }
    })
}