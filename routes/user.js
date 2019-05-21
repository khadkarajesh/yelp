var User = require('../controller/user')
var router = require('express').Router()
const validator = require('../helpers/auth.validation')

router.route('/signin').
    post(User.signin)

router.route('/signup')
    .post(validator.register, User.signup)

router.route('/google')
    .post(User.authorizeByGoogle)

router.route('/email-verification')
    .post(User.verifyEmail)

router.route('/resend-verification-email')
    .post(User.resendEmailVerification)


module.exports = router