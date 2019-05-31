const request = require('request')

module.exports.getUserInfo = async function (accessToken) {
    request.get(`https://www.googleapis.com/plus/v1/people/me?access_token=${accessToken}`,
        (error, response, body) => {
            return body
        })
}
