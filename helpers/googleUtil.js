const { google } = require('googleapis')
const oauth2 = google.oauth2('v2')
const OAuth2 = google.auth.OAuth2
const request = require('request')

const authClient = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

module.exports.getUserInfo = async function (accessToken) {
    request.get(`https://www.googleapis.com/plus/v1/people/me?access_token=${accessToken}`, (error, response, body) => {
        console.log(body)
        return body
    })
}

