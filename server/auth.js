var passport = require('passport'),
    YoutubeV3Strategy = require('passport-youtube-v3').Strategy,
    env = process.env;

try {
    var config = require('./config');
    var credentials = config.services.youtube;
} catch (err) {
    console.error('Add file config.json like config.example.json');
}

var clientID = env.YOUTUBE_APP_ID || credentials.client_id,
    clientSecret = env.YOUTUBE_APP_SECRET || credentials.client_secret;

function verify(accessToken, refreshToken, profile, done) {
    profile = JSON.parse(profile._raw);

    return done(null, {
        token: accessToken,
        refreshtoken: refreshToken,
        profile: profile
    });
}

module.exports = passport;

// serialize user into the session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

if (!clientID || !clientSecret) {
    console.error('Please provide clientID and clientSecret');
} else {
    passport.use(new YoutubeV3Strategy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: '/auth/youtube/callback',
        scope: ['https://www.googleapis.com/auth/youtube.readonly']
    }, verify));
}
