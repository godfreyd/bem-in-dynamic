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
    clientTwitter = new Twitter(config.services.twitter),

    // REST YouTube API

    Youtube = require('./googleyoutube'),
    clientYoutube = new Youtube();





    // google = require('googleapis'),
    // OAuth2 = google.auth.OAuth2;
    // var oauth2Client = new OAuth2(config.services.youtube.client_id, config.services.youtube.client_secret, config.services.youtube.redirect_url);

    // // var oauth2Client = new OAuth2(config.services.youtube.client_id, config.services.youtube.client_secret, config.services.youtube.redirect_url);
    // // Retrieve tokens via token exchange explained above or set them:
    // oauth2Client.setCredentials({
    //     access_token: config.services.youtube.access_token,
    //     refresh_token: config.services.youtube.refresh_token,
    //     // Optional, provide an expiry_date (milliseconds since the Unix Epoch)
    //     expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)
    // });


    // var youtube = google.youtube({
    //     version: 'v3',
    //     auth: oauth2Client
    // });











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
        q = query.q || 'bem',
        params = {
        q: '#' + q,
        // the max_id is passed in via a query string param
        // https://dev.twitter.com/rest/public/timelines
        max_id: query.max_id && query.max_id,
        count: 12,
        lang: 'en',
        result_type: 'recent'
    };


    var twitterRequest = new Promise(function(resolve, reject) {

        clientTwitter.get('search/tweets', params, function(err, data) {

            if(err) {
                reject(err);
            }

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

            resolve(tweets);

        });
    });


    var code = (query.code) ? query.code : '';

    // если токена нет
    if(!clientYoutube.isTokenExists()) {
        // если кода нет
        if(!code || 0 === code.length) {
            console.log('1')
            var authURL =  clientYoutube.getAuthUrl();
            res.redirect(authURL);

        }else{
            // если код есть, получаем токен и записываем его в файл
            console.log('2')
            tokens =  clientYoutube.getToken(code);
            res.redirect('/');

        }

    }


    var params = {
        q: q,
        // max_id: query.max_id && query.max_id,
        maxResults: 12,
        type: 'video',
        part: 'snippet'
    };


    var youtubeRequest = new Promise(function(resolve, reject) {

        // youtube.search.list(params, function(err, response) {

        //     if(err) {
        //         reject(err);
        //         // res.status(500);
        //         // return render(req, res, { view: 500 });
        //         return console.log(err);
        //     }

        //     var video = response.items.map(function(video) {
        //         return {
        //             name: video.snippet.channelTitle,
        //             time: video.snippet.publishedAt,
        //             q: params.q,
        //             // id: tweet.id,
        //             url: 'https://www.youtube.com/watch?v=' + video.id.videoId,
        //             // avatar: tweet.user.profile_image_url,
        //             message: video.description,
        //             service: 'youtube'
        //         };
        //     });

        //     resolve(video);

        // });


        clientYoutube.searchList(params, function(err, response){

            if(err) {
                reject(err);
                // res.status(500);
                // return render(req, res, { view: 500 });
                return console.log(err);
            }

            var video = response.items.map(function(video) {
                return {
                    name: video.snippet.channelTitle,
                    time: video.snippet.publishedAt,
                    q: params.q,
                    // id: tweet.id,
                    url: 'https://www.youtube.com/watch?v=' + video.id.videoId,
                    // avatar: tweet.user.profile_image_url,
                    message: video.description,
                    service: 'youtube'
                };
            });

            resolve(video);
        });


    });

    Promise.all([youtubeRequest, twitterRequest]).then(function(results) {

        function convertarray(array) {
            var res = [];
            for (var i=0; i<array.length; i++) {
                if (!Array.isArray(array[i])) {
                    res.push(array[i]);
                } else {
                    res = res.concat(convertarray(array[i]));
                }

            }
            return res;

        }

        var result = convertarray(results);

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
