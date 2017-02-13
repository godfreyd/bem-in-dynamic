Object.assign || (Object.assign = require('object-assign'));

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
    isDev = process.env.NODE_ENV === 'development';


    // REST Twitter API
    var Twitter = require('twitter');
    var twitterkeys = require('./twitterkeys');
    var client = new Twitter({
      consumer_key: twitterkeys.consumer_key,
      consumer_secret: twitterkeys.consumer_secret,
      access_token_key: twitterkeys.access_token_key,
      access_token_secret: twitterkeys.access_token_secret
    });


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

    var tweets = [], tweetsResult = [];

    if (req.xhr) {

        var params = {q: '#' + req.query.q, count: 12, lang: 'en', result_type: 'recent'};

        // the max_id is passed in via a query string param
        if(req.query.max_id) {
            params.max_id = req.query.max_id;
        }

    } else {

        var params = {q: '#bem', count: 12, lang: 'en', result_type: 'recent'};
    }

    // request data
    client.get('search/tweets', params, function (err, data, resp) {

        if(err) throw err;

        tweets = data.statuses;

        var i = 0, len = tweets.length;

        console.log(params.q);


        for(i; i < len; i++) {

            var tweet = {};
            tweet.name = tweets[i].user.name;
            tweet.time = tweets[i].created_at;
            tweet.q = params.q;
            tweet.id = tweets[i].id;
            tweet.url = 'https://twitter.com/' + tweets[i].user.screen_name + '/status/' + tweets[i].id_str;
            tweet.avatar = tweets[i].user.profile_image_url;
            tweet.message = tweets[i].text;
            tweet.service = 'twitter';
            tweetsResult.push(tweet);

        }



        if (req.xhr) {

            return render(req, res, {
                tweetsResult: tweetsResult
            }, { block: 'lost'});

        }

        render(req, res, {
            view: 'index',
            title: 'Social Services Search Robot',
            meta: {
                description: 'Page description',
                og: {
                    url: 'http://localhost:3000',
                    siteName: 'БЭМ'
                }
            },
            tweetsResult: tweetsResult

        });


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
