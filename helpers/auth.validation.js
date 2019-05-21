const { check, body, notEmpty } = require('express-validator/check')

exports.register = [
    check('name').not().isEmpty().withMessage('Enter valid name'),
    check('email').isEmail().withMessage('Enter valid email address'),
    check('password')
        .matches(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,}$/)
        .withMessage('Password must contain alphanumeric characters of minimum length 6')
];