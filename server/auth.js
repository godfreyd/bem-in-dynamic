var passport = require('passport'),
    YoutubeV3Strategy = require('passport-youtube-v3').Strategy,
    env = process.env;

if (!env.YOUTUBE_APP_ID || !env.YOUTUBE_APP_SECRET) {
    try {
        var config = require('./config'),
            servicesYouTube = config.services.youtube;
    } catch (err) {}
}

var clientID = env.YOUTUBE_APP_ID || servicesYouTube.client_id,
    clientSecret = env.YOUTUBE_APP_SECRET || servicesYouTube.client_secret;

if (!clientID || !clientSecret) {
    console.error('Please provide youtube app id and youtube app secret via ENV vars or add config.json (see config.example.json for reference).');
    process.exit(1);
}

function verify(accessToken, refreshToken, profile, done) {
    if (!profile) return done(null, false);

    return done(null, {
        token: accessToken,
        refreshtoken: refreshToken,
        profile: JSON.parse(profile._raw)
    });
}

// serialize user into the session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new YoutubeV3Strategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: '/auth/youtube/callback',
    scope: ['https://www.googleapis.com/auth/youtube.readonly']
}, verify));

module.exports = passport;
