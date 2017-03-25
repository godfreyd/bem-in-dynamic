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

app.get('/', function(req, res) {
    var query = req.query,
        params = {
        // the max_id is passed in via a query string param
        // https://dev.twitter.com/rest/public/timelines
        max_id: query.max_id && query.max_id,
        count: 12,
        lang: 'en',
        result_type: 'recent'
    };
    q = params.q = query.q ? '#' + query.q : '#bem';


    var twitterRequest = new Promise(function(resolve, reject) {

        clientTwitter.get('search/tweets', params, function(err, data) {

            if(err) {
                reject(err);
            }

            var tweets = data.statuses.map(function(tweet) {
                return {
                    name: tweet.user.name,
                    time: tweet.created_at, // UTC time
                    q: params.q,
                    id: tweet.id,
                    url: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                    avatar: tweet.user.profile_image_url,
                    message: tweet.text,
                    service: 'twitter'
                };
            });


            var lastTweet = tweets[tweets.length -1],
                maxId = lastTweet.id,
                tweetsList = {};
                tweetsList.maxid = maxId;
                tweetsList.tweets = tweets;

            resolve(tweetsList);

        });
    });


    var code = (query.code) ? query.code : '';

    // если токена нет
    if(!clientYoutube.isTokenExists()) {
        // если кода нет
        if(!code || 0 === code.length) {
            var authURL =  clientYoutube.getAuthUrl();
            res.redirect(authURL);

        }else{
            // если код есть, получаем токен и записываем его в файл
            tokens =  clientYoutube.getToken(code);
            res.redirect('/');

        }

    }


    var params = {
        q: q,
        pageToken: query.next_page && query.next_page,
        maxResults: 12,
        relevanceLanguage: 'en',
        type: 'video',
        order: 'date',
        part: 'snippet'
    };


    var youtubeRequest = new Promise(function(resolve, reject) {


        clientYoutube.searchList(params, function(err, data){

            if(err) {
                reject(err);
                // res.status(500);
                // return render(req, res, { view: 500 });
                return console.log(err);
            }


            var video = data.items.map(function(video) {
                return {
                    name: video.snippet.channelTitle,
                    time: video.snippet.publishedAt, // RFC 3339 formatted date-time
                    q: params.q,
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

        var nextpage = results[0].nextpage;
        var clips = results[0].clips;
        var maxid = results[1].maxid;
        var tweets = results[1].tweets;
        var result = clips.concat(tweets);

        for (var i =0; i<result.length; i++) {

            result[i].time = +new Date(result[i].time);

        }

        function compareTime(itemA, itemB) {
          return itemA.time - itemB.time;
        }

        result.sort(compareTime);


        for (var i =0; i<result.length; i++) {

            result[i].time = moment(result[i].time).fromNow();

        }

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
            result: result
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
