var path = require('path'),
    express = require('express'),

    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    serveStatic = require('serve-static'),

    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    passport = require('passport'),

    slashes = require('connect-slashes'),
    // LocalStrategy = require('passport-local').Strategy,
    csrf = require('csurf'),
    compression = require('compression'),

    config = require('./config'),
    staticFolder = config.staticFolder,

    Render = require('./render'),
    render = Render.render,

    routes = require('./routes'),
    baseUrl = '/',

    isDev = process.env.NODE_ENV === 'development',

    app = express();

require('debug-http')();

app
    .disable('x-powered-by')
    .enable('trust proxy')
    .get('/ping', (req, res) => res.end('ok'))
    .use(compression())
    .use(favicon(path.join(staticFolder, '/images/favicon.ico')))
    .use(serveStatic(staticFolder))
    .use(morgan('combined'))
    .use(cookieParser())
    .use(bodyParser.json({ limit: '20mb' }))
    .use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
    .use(expressSession({
        resave: true,
        saveUninitialized: true,
        secret: config.sessionSecret
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(baseUrl, routes)
    .use(csrf());

// NOTE: conflicts with livereload
isDev || app.use(slashes());

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

module.exports = app;
