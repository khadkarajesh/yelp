var User = require('../controller/user')
var router = require('express').Router()

router.route('/signup')
    .post(User.create)

module.exports = router