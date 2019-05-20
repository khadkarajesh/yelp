var User = require('../db/models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AppError = require('../helpers/AppError')
const googleUtil = require('../helpers/googleUtil')
const awsEmailSender = require('../helpers/awsEmailSender')
const { validationResult } = require('express-validator/check')

module.exports = {
    signup,
    signin,
    authorizeByGoogle,
    verifyEmail,
    resendEmailVerification
}

const MSG_EMAIL_ALREADY_EXIST = 'This email is already registered'
const INVALID_PASSWORD = 'Invalid username/password'


async function signup(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        var user = await User.findOne({ 'local.email': req.body.email })
        if (user) throw new AppError(MSG_EMAIL_ALREADY_EXIST, 409)
        var salt = await bcrypt.genSalt(10)
        var hash = await bcrypt.hash(req.body.password, salt)

        var newUser = await new User({
            "local": {
                name: req.body.name,
                email: req.body.email,
                password: hash
            }
        }).save()

        console.log(`${req.headers.host}`)
        var token = await jwt.sign({ id: newUser._id },
            process.env.APP_SECRET_KEY,
            { expiresIn: '24h' })
        encodedUrl = `http://localhost:3000/email-verification?token=${token}`
        awsEmailSender.sendVerificationEmail(req.body.name,'rajesh.k.khadka@gmail.com', encodedUrl)
        res.json({ message: "success", data: newUser.toJSON().local })
    } catch (error) {
        next(error)
    }
}

async function verifyEmail(req, res, next) {
    try {
        var token = await jwt.verify(req.body.token, process.env.APP_SECRET_KEY)
        var user = await User.findOne({ _id: token.id })
        if (!user) throw new AppError('User not found', 404)
        if (user.local.email_verified) {
            res.json({ status: 'success', data: 'Email has been verified already' })
        } else {
            user.local.email_verified = true
            var updatedUser = await user.save()
            if (updatedUser.local.email_verified) {
                res.json({ status: 'success', data: 'Email has been verified successfully' })
            }
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}


async function resendEmailVerification(req, res, next) {
    try {
        var user = await User.findOne({ 'local.email': req.body.email })
        if (!user) throw new AppError('User not found', 404)
        if (user.local.email_verified) res.json({ status: 'success', data: 'Email has been verified already' })
        var token = await jwt.sign({ id: user._id },
            process.env.APP_SECRET_KEY,
            { expiresIn: '24h' })
        encodedUrl = `http://localhost:3000/email-verification?token=${token}`
        awsEmailSender.sendVerificationEmail('',req.body.email, encodedUrl)
        res.json({ message: "success", data: "Successfully sent a verification email" })
    } catch (error) {
        next(error)
    }
}



async function signin(req, res, next) {
    try {
        var user = await User.findOne({ email: req.body.username })
        if (!user) throw new AppError(INVALID_PASSWORD, 401)
        if (!user.local.email_verified) throw new AppError("Your email has not verified", 401)

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