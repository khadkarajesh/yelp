var Business = require('../controller/business')
var router = require('express').Router()

router.route('/')
    .post(Business.create)
    .get(Business.list)
    .put(Business.update)

module.exports = router