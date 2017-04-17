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

    moment = require('moment'),

    // REST Twitter API
    Twitter = require('twitter'),
    clientTwitter = new Twitter(config.services.twitter),

    // REST YouTube API
    Youtube = require('./googleyoutube'),
    clientYoutube = new Youtube(config.services.youtube);


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

function getYoutubeData(params) {

    var youtubeRequest = new Promise(function(resolve, reject) {

        clientYoutube.searchList(params, function(err, data){

            var videos,
                youtube = {};

            if (err) {
                reject(err);
                return;
            }

            videos = data.items.map(function(item) {
                return {
                    name: item.snippet.channelTitle,
                    time: item.snippet.publishedAt, // RFC 3339 formatted date-time
                    q: params.q,
                    nextpage: data.nextPageToken,
                    url: 'https://www.youtube.com/embed/' + item.id.videoId,
                    service: 'youtube'
                };
            });

            youtube.nextPageId = videos[videos.length -1].nextpage;
            youtube.videos = videos;

            resolve(youtube);
        });
    });

    return youtubeRequest;
}

function getTwitterData(params) {

    var twitterRequest = new Promise(function(resolve, reject) {

        clientTwitter.get('search/tweets', params, function(err, data) {

            var tweets,
                twitter = {};

            if (err) {
                reject(err);
                return;
            }

            tweets = data.statuses.map(function(item) {
                return {
                    name: item.user.name,
                    time: item.created_at, // UTC time
                    q: params.q,
                    id: item.id,
                    url: 'https://twitter.com/' + item.user.screen_name + '/status/' + item.id_str,
                    avatar: item.user.profile_image_url,
                    message: item.text,
                    service: 'twitter'
                };
            });


            twitter.nextPageId = tweets[tweets.length -1].id;
            twitter.tweets = tweets;

            resolve(twitter);

        });
    });

    return twitterRequest;
}

app.get('/', function(req, res) {
    var query = req.query,
        code = query.code || '',
        q = query.q ? '#' + query.q : '#bem',
        youtube = query.youtube,
        twitter = query.twitter;


    var youtubeParams = {
        q: q,
        pageToken: query && query.next_page,
        maxResults: 12,
        relevanceLanguage: 'en',
        type: 'video',
        order: 'date',
        part: 'snippet'
    };

    var twitterParams = {
        // the max_id is passed in via a query string param
        // https://dev.twitter.com/rest/public/timelines
        max_id: query && query.max_id,
        count: 12,
        lang: 'en',
        result_type: 'recent',
        q: q
    };


    function checkYoutubeAuth() {
        // если токена нет
        if (!clientYoutube.isTokenExists()) {
            // если кода нет
            if (!code || 0 === code.length) {
                var authURL = clientYoutube.getAuthUrl();

                return res.redirect(authURL);
            } else {
                // если код есть, получаем токен и записываем его в файл
                var tokens = clientYoutube.getToken(code);

                return res.redirect('/');
            }
        }
    }

    if (req.xhr) {

        if (youtube) {

            checkYoutubeAuth();
            var youtubeRequest = getYoutubeData(youtubeParams);

        }

        if (twitter) {

            var twitterRequest = getTwitterData(twitterParams);
        }

    } else {

        checkYoutubeAuth();
        var youtubeRequest = getYoutubeData(youtubeParams);
        var twitterRequest = getTwitterData(twitterParams);
    }


    Promise.all([youtubeRequest, twitterRequest]).then(function(results) {

        if (results[0] !== undefined) {

            var youtube = results[0],
                youtubeNextPageId = youtube.nextPageId,
                videos = youtube.videos;
        }

        if (results[1] !== undefined) {

            var twitter = results[1],
                twitterNextPageId = twitter.nextPageId,
                tweets = twitter.tweets;
        }

        if (videos && tweets) {

            var  results = videos.concat(tweets);

        } else {

            var  results = videos ? videos : tweets;
        }

        console.log(results);

        results
            .forEach(function(item) {
                item.time = +new Date(item.time);
            });
        results
            .sort(function compareTime(itemA, itemB) {
                return itemB.time - itemA.time;
            })
            .forEach(function(item) {
                item.time = moment(item.time).fromNow();
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
            q: q,
            maxid: twitterNextPageId,
            nextpage: youtubeNextPageId,
            result: results
        }, req.xhr && { block: 'result' });

    }).catch(function(err) {
        console.log(err);
        res.status(500);
        render(req, res, {
            view: '500'
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
