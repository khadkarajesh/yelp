var Strategy = require('passport-facebook-token')
const passport = require('passport')
const User = require('../db/models/user')
passport.use(new Strategy({
    clientID: '2303355803286582',
    clientSecret: 'a8d3be2a822806ac389c5aec5ea35782',
    fbGraphVersion: 'v3.0'
}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    var userInfo = profile
    try {
        var user = await User.findOne({ 'facebook.id': userInfo.id })
        if (user) {
            return done(null, user)
        } else if (localUser = await User.findOne({ 'local.email': userInfo.emails[0].value })) {
            localUser.facebook = {
                id: userInfo.id,
                email: userInfo.emails[0].value,
                name: userInfo.displayName
            }
            await localUser.save()
            return done(null, localUser)
        } else {
            var newUser = await new User({
                'facebook': {
                    id: userInfo.id,
                    email: userInfo.emails[0].value,
                    name: userInfo.displayName
                }
            }).save()
            return done(null, newUser)
        }
    } catch (err) {
        console.log(err)
        return done(err, null)
    }
}))

module.exports = passport