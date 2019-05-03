var User = require('../db/models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AppError = require('../helpers/AppError')

module.exports = {
    signup,
    signin,
    getUserByEmail
}

async function signup(req, res, next) {
    try {
        var user = await User.findOne({ email: req.body.email })
        if (user) throw new AppError("This email is already registered", 409)
        var valid = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,}$/.test(req.body.password)
        if (!valid) {
            throw new AppError("Password must be length of min 6 must contain at least 1 number,1 lowercase, 1 capital letter, 1 special character", 400)
        }
        var salt = await bcrypt.genSalt(10)
        var hash = await bcrypt.hash(req.body.password, salt)

        var accessToken = await jwt.sign({ email: req.body.email }, process.env.APP_SECRET_KEY, { expiresIn: 60 * 60 })
        var refreshToken = await jwt.sign({ email: req.body.email }, process.env.APP_SECRET_KEY, { expiresIn: 24 * 60 * 60 })

        var newUser = await new User({
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hash,
            refreshToken: refreshToken
        }).save()

        res.json({ message: "success", accessToken: accessToken, refreshToken: refreshToken, data: newUser })
    } catch (error) {
        next(error)
    }
}

async function signin(req, res, next) {
    try {
        var salt = await bcrypt.genSalt(10)
        var user = await User.findOne({ email: req.body.username })
        if (!user) throw new AppError('Invalid username/password', 401)

        var result = await bcrypt.compare(req.body.password, user.password)
        if (result) {
            var accessToken = await jwt.sign({ email: user.email },
                process.env.APP_SECRET_KEY,
                { expiresIn: 60 * 60 })
            var refreshToken = await jwt.sign({ email: user.email },
                process.env.APP_SECRET_KEY,
                { expiresIn: 24 * 60 * 60 })
            user.refreshToken.push(refreshToken)
            await user.save()
            return res.json({
                message: "success",
                accessToken: accessToken,
                refreshToken: refreshToken,
                data: user
            })
        }
    } catch (error) {
        next(error)
    }
}

async function getUserByEmail(email) {
    return await User.findOne({ email: email })
}