const AppError = require('../helpers/AppError')
module.exports = function (err, req, res, next) {
    console.log(err)
    if (typeof (err) == 'string') {
        return res.status(400).json({ message: err })
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.toString().replace('ValidationError: ', '').split(',')[0] })
    }

    if (err instanceof AppError) {
        return res.status(err.status).json({ errors:[{msg: err.message}] })
    }

    return res.status(500).json({ message: err.message })
}