const expressJwt = require('express-jwt');

module.exports = jwt;

function jwt() {
    const secret = process.env.APP_SECRET_KEY
    return expressJwt({ secret}).unless({
        path: [
            '/auth/signin',
            '/auth/signup',
            '/auth/google',
            '/auth/email-verification'
        ]
    });
}