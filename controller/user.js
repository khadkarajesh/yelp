var User = require('../db/models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AppError = require('../helpers/AppError')
const PASSWORD_VALIDATION_REGEX = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,}$/
const MSG_EMAIL_ALREADY_EXIST = 'This email is already registered'
const MSG_INVALID_PASSWORD = 'Password must be length of min 6 must contain at least 1 number,1 lowercase, 1 capital letter, 1 special character'
const ACCESS_TOKEN_EXPIRY_TIME = 60 * 60
const REFRESH_TOKEN_EXPIRY_TIME = 24 * 60 * 60
const MSG_INVALID_PASSWORD = 'Invalid username/password'


exports.signup = async function (req, res, next) {
    try {
        var user = await User.findOne({ email: req.body.email })
        if (user) throw new AppError(MSG_EMAIL_ALREADY_EXIST, 409)
        var valid = PASSWORD_VALIDATION_REGEX.test(req.body.password)
        if (!valid) {
            throw new AppError(MSG_INVALID_PASSWORD, 400)
        }
        var salt = await bcrypt.genSalt(10)
        var hash = await bcrypt.hash(req.body.password, salt)

        var accessToken = await jwt.sign({ email: req.body.email }, process.env.APP_SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRY_TIME })
        var refreshToken = await jwt.sign({ email: req.body.email }, process.env.APP_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRY_TIME })

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

exports.signin = async function (req, res, next) {
    try {
        var salt = await bcrypt.genSalt(10)
        var hash = await bcrypt.hash(req.body.password, salt)
        var user = await User.findOne({ email: req.body.username, password: hash })
        if (!user) throw new AppError(MSG_INVALID_PASSWORD, 401)

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
    } catch (error) {
        next(error)
    }
}