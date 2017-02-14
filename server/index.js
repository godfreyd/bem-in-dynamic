var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    serveStatic = require('serve-static'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    slashes = require('connect-slashes'),
    passport = require('passport'),
    // LocalStrategy = require('passport-local').Strategy,
    csrf = require('csurf'),
    compression = require('compression'),

    config = require('./config'),
    staticFolder = config.staticFolder,

    Render = require('./render'),
    render = Render.render,
    dropCache = Render.dropCache, // eslint-disable-line no-unused-vars

    port = process.env.PORT || config.defaultPort,
    isSocket = isNaN(port),
    isDev = process.env.NODE_ENV === 'development',

    // REST Twitter API
    Twitter = require('twitter'),
    client = new Twitter(config.services.twitter);

require('debug-http')();

app
    .disable('x-powered-by')
    .enable('trust proxy')
    .use(compression())
    .use(favicon(path.join(staticFolder, '/images/favicon.ico')))
    .use(serveStatic(staticFolder))
    .use(morgan('combined'))
    .use(cookieParser())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(expressSession({
        resave: true,
        saveUninitialized: true,
        secret: config.sessionSecret
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(csrf());

// NOTE: conflicts with livereload
isDev || app.use(slashes());

passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
    done(null, JSON.parse(user));
});

app.get('/ping/', function(req, res) {
    res.send('ok');
});

app.get('/', function(req, res) {
    var query = req.query,
        params = {
        q: query.q ? '#' + query.q : '#bem',
        // the max_id is passed in via a query string param
        // https://dev.twitter.com/rest/public/timelines
        max_id: query.max_id && query.max_id,
        count: 12,
        lang: 'en',
        result_type: 'recent'
    };

    // request data
    client.get('search/tweets', params, function(err, data) {
        if (err) {
            res.status(500);

            return render(req, res, { view: 500 });
        };

        var tweets = data.statuses.map(function(tweet) {
            return {
                name: tweet.user.name,
                time: tweet.created_at,
                q: params.q,
                id: tweet.id,
                url: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                avatar: tweet.user.profile_image_url,
                message: tweet.text,
                service: 'twitter'
            };
        });

        render(req, res, {
            view: 'index',
            title: 'Social Services Search Robot',
            meta: {
                description: 'Page description', // TODO: придумать описание
                og: {
                    url: 'http://localhost:3000',
                    siteName: 'BEM'
                }
            },
            tweets: tweets
        }, req.xhr && { block: 'result' });
    });
});

isDev && require('./rebuild')(app);

app.get('*', function(req, res) {
    res.status(404);
    return render(req, res, { view: '404' });
});

if (isDev) {
    app.get('/error/', function() {
        throw new Error('Uncaught exception from /error');
    });

    app.use(require('errorhandler')());
}

isSocket && fs.existsSync(port) && fs.unlinkSync(port);

app.listen(port, function() {
    isSocket && fs.chmod(port, '0777');
    console.log('server is listening on', this.address().port);
});
