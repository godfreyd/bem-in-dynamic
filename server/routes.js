var router = require('express').Router(),
    controllers = require('./controllers'),
    passportYouTube = require('./auth'),
    middleware = require('./middleware/auth'),
    isAuthenticated = middleware.isAuthenticated;

router
    .get('/auth/youtube', passportYouTube.authenticate('youtube'))
    .get('/auth/youtube/callback', passportYouTube.authenticate('youtube', { failureRedirect: '/error', failureFlash: true }), (req, res) => {
        res.redirect('/');
    })
    .get('/', isAuthenticated, controllers.getContent);

module.exports = router;
