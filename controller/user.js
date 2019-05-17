var User = require('../db/models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AppError = require('../helpers/AppError')
const googleUtil = require('../helpers/googleUtil')

module.exports = {
    signup,
    signin,
    authorizeByGoogle
}

const PASSWORD_VALIDATION_REGEX = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,}$/
const MSG_EMAIL_ALREADY_EXIST = 'This email is already registered'
const MSG_INVALID_PASSWORD = 'Password must be length of min 6 must contain at least 1 number,1 lowercase, 1 capital letter, 1 special character'
const ACCESS_TOKEN_EXPIRY_TIME = 60 * 60
const REFRESH_TOKEN_EXPIRY_TIME = 24 * 60 * 60
const INVALID_PASSWORD = 'Invalid username/password'


async function signup(req, res, next) {
    try {
        var user = await User.findOne({ email: req.body.email })
        if (user) throw new AppError(MSG_EMAIL_ALREADY_EXIST, 409)
        var valid = PASSWORD_VALIDATION_REGEX.test(req.body.password)
        if (!valid) {
            throw new AppError(MSG_INVALID_PASSWORD, 400)
        }
        var salt = await bcrypt.genSalt(10)
        var hash = await bcrypt.hash(req.body.password, salt)

        var newUser = await new User({
            "local": {
                name: req.body.name,
                email: req.body.email,
                password: hash
            }
        }).save()
        res.json({ message: "success", data: newUser.toJSON().local})
    } catch (error) {
        next(error)
    }
}

async function signin(req, res, next) {
    try {
        var user = await User.findOne({ email: req.body.username })
        if (!user) throw new AppError(INVALID_PASSWORD, 401)

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


async function authorizeByGoogle(req, res, next) {
    try {
        console.log("reached here")
        var userInfo = googleUtil.getUserInfo(req.body.accessToken)
        var user = await User.findOne({ google: { id: userInfo.id } })
        var accessToken = await jwt.sign({ email: userInfo.email },
            process.env.APP_SECRET_KEY,
            { expiresIn: 60 * 60 })
        var refreshToken = await jwt.sign({ email: userInfo.email },
            process.env.APP_SECRET_KEY,
            { expiresIn: 24 * 60 * 60 })
        console.log(user)
        if (user) {
            console.log(`inside user exist ${refreshToken}`)
            user.refreshToken.push(refreshToken)
            await user.save()
            return res.json({
                message: "success",
                accessToken: accessToken,
                refreshToken: refreshToken,
                data: user
            })
        } else {
            console.log('inside user doesnt exist')
            var newUser = await new User({
                first_name: userInfo.given_name,
                last_name: userInfo.family_name,
                email: userInfo.email,
                refreshToken: refreshToken,
                gmail_id: userInfo.id
            }).save()
            return res.json({
                message: 'success',
                accessToken: accessToken,
                refreshToken: refreshToken,
                data: newUser
            })
        }

    } catch (err) {
        next(err)
    }
}