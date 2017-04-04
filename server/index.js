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
    Youtube = require('./googleyoutube')(config.services.youtube),
    clientYoutube = new Youtube();


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

function getYoutubeData() {

}

function getTwitterData() {

}

app.get('/', function(req, res) {
    var query = req.query,
        code = query.code || '',
        q = query.q ? '#' + query.q : '#bem';

    // TODO: поддержать отключение ютуба

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

    var twitterParams = {
        // the max_id is passed in via a query string param
        // https://dev.twitter.com/rest/public/timelines
        max_id: query.max_id && query.max_id,
        count: 12,
        lang: 'en',
        result_type: 'recent',
        q: q
    };

    var twitterRequest = new Promise(function(resolve, reject) {
        clientTwitter.get('search/tweets', twitterParams, function(err, data) {
            if (err) {
                reject(err);
                return;
            }

            var tweets = data.statuses.map(function(tweet) {
                return {
                    name: tweet.user.name,
                    time: tweet.created_at, // UTC time
                    q: twitterParams.q,
                    id: tweet.id,
                    url: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                    avatar: tweet.user.profile_image_url,
                    message: tweet.text,
                    service: 'twitter'
                };
            });

            var lastTweet = tweets[tweets.length -1];

            resolve({
                tweets: tweets,
                maxid: lastTweet.id
            });
        });
    });

    var youtubeParams = {
        q: q,
        pageToken: query.next_page && query.next_page,
        maxResults: 12,
        relevanceLanguage: 'en',
        type: 'video',
        order: 'date',
        part: 'snippet'
    };

    var youtubeRequest = new Promise(function(resolve, reject) {
        clientYoutube.searchList(youtubeParams, function(err, data){
            if (err) {
                reject(err);
                // res.status(500);
                // return render(req, res, { view: 500 });
                return console.log(err);
            }

            var video = data.items.map(function(video) {
                return {
                    name: video.snippet.channelTitle,
                    time: video.snippet.publishedAt, // RFC 3339 formatted date-time
                    q: youtubeParams.q,
                    nextpage: data.nextPageToken,
                    url: 'https://www.youtube.com/embed/' + video.id.videoId,
                    // avatar: tweet.user.profile_image_url,
                    // message: video.description,
                    service: 'youtube'
                };
            });

            var lastClip = video[video.length -1];
                nextPage = lastClip.nextpage,
                clipsList = {};
                clipsList.nextpage = nextPage;
                clipsList.clips = video;

            resolve(clipsList);
        });
    });

    Promise.all([youtubeRequest, twitterRequest]).then(function(results) {
        var youtubeData = results[0],
            twitterData = results[1],
            nextpage = youtubeData.nextpage,
            clips = youtubeData.clips,
            maxid = twitterData.maxid,
            tweets = twitterData.tweets,
            results = clips.concat(tweets);

        results
            .forEach(function(item) {
                item.time = +new Date(results[i].time);
            })
            .sort(function compareTime(itemA, itemB) {
                return itemB.time - itemA.time;
            })
            .forEach(function(item) {
                item.time = moment(results[i].time).fromNow();
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
            maxid: maxid,
            nextpage: nextpage,
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
