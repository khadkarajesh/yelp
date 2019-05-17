var User = require('../controller/user')
var router = require('express').Router()

router.route('/signin').
    post(User.signin)

router.route('/signup')
    .post(User.signup)

router.route('/google')
      .post(User.authorizeByGoogle)

module.exports = router