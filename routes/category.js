var Category = require('../controller/category')
var router = require('express').Router()

router.route('/')
    .post(Category.create)
    .get(Category.list)

module.exports = router