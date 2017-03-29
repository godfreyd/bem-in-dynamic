var fs = require('fs'),
    path = require('path'),
    google = require('googleapis'),
    OAuth2 = google.auth.OAuth2;

function GoogleYoutube(credentials) {
    this.oauth2Client = new OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_url);
};

GoogleYoutube.prototype.isTokenExists = function() {
    if (fs.existsSync(path.join(__dirname, 'youtubetoken.txt'))) {
        var tokens = this.fetchTokenFromFile();

        if (tokens.access_token !== undefined && tokens.access_token !== '') {
            return true;
        }
    }

    return false;
};

GoogleYoutube.prototype.fetchTokenFromFile = function() {
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, 'youtubetoken.txt'), 'utf-8'));
    } catch(err) {
        console.log('No youtubetoken.txt was found');
    }
};

GoogleYoutube.prototype.getAuthUrl = function() {
    // TODO: найти минимальный скоуп для поиска по видео
    var scopes = [
        'https://www.googleapis.com/auth/youtube'
    ];

    return this.oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        // If you only need one scope you can pass it as a string
        scope: scopes
    });
};


GoogleYoutube.prototype.getToken = function(code) {
    this.oauth2Client.getToken(code, function(err, tokens) {
        if (err) {
            console.error('Error while trying to retrieve access token', err);
            return;
        }

        if (tokens) {
            fs.writeFileSync(path.join(__dirname, 'youtubetoken.txt'), JSON.stringify(tokens), 'utf8');
        }

        return tokens;
    });
};

GoogleYoutube.prototype.refreshToken = function(tokens, callback) {
    var isTokenExpired = false;

    if (tokens) {
        isTokenExpired = tokens.expiry_date <= (new Date()).getTime();
    }

    // если токен не закончился, то возвращаем текущий токен
    if (!isTokenExpired) {
        callback(null, tokens);

        return false;
    }

    // если токен протух, генерируем новый
    this.oauth2Client.setCredentials(tokens);
    this.oauth2Client.refreshAccessToken(function(err, tokens) {
        if (err) {
            console.log('Error while trying to get refresh token', err);

            callback(err, null);

            return false;
        }

        if (tokens) {
            fs.writeFileSync(path.join(__dirname, 'youtubetoken.txt'), JSON.stringify(tokens), 'utf8');
            callback(null, tokens);
        }

        return tokens;
    });
};

GoogleYoutube.prototype.searchList = function(params, callback) {
    var _this = this,
        tokens = this.fetchTokenFromFile();


    this.refreshToken(tokens, function(err, tokens) {
        if (err) {
            console.error(err);

            return;
        }

        _this.oauth2Client.setCredentials(tokens);

        var youtube = google.youtube({
            version: 'v3',
            auth: _this.oauth2Client
        });

        youtube.search.list(params, function(err, response) {
            err ? callback(err, null) : callback(null, response);
        });
    });
};

module.exports = GoogleYoutube;
