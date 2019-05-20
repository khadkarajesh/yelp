var User = require('../controller/user')
var router = require('express').Router()
const validator = require('../helpers/auth.validation')

router.route('/signin').
    post(User.signin)

router.route('/signup')
    .post(validator.register, User.signup)

router.route('/google')
    .post(User.authorizeByGoogle)

module.exports = router