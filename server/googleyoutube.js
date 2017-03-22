var fs = require('fs'),
    path = require('path'),
    config = require('./config'),
    google = require('googleapis'),
    OAuth2 = google.auth.OAuth2,
    oauth2Client;

var googleyoutube = function(){
    this.oauth2Client = new OAuth2(config.services.youtube.client_id, config.services.youtube.client_secret, config.services.youtube.redirect_url);
};

googleyoutube.prototype.isTokenExists = function() {
    if (fs.existsSync(path.join(__dirname, 'youtubetoken.txt'))) {
        var tokens = this.fetchTokenFromFile();
        if(tokens.access_token !== undefined && tokens.access_token !== '') {
            return true;
        }
    }
    return false;
};

googleyoutube.prototype.fetchTokenFromFile = function() {
    var tokens = fs.readFileSync(path.join(__dirname, 'youtubetoken.txt'), 'utf-8');
    tokens = JSON.parse(tokens);
    return tokens;
};

googleyoutube.prototype.getAuthUrl = function() {

    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
      'https://www.googleapis.com/auth/youtube'
    ];

    var url = this.oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      // If you only need one scope you can pass it as a string
      scope: scopes,
      // Optional property that passes state parameters to redirect URI
      // state: { foo: 'bar' }
      // approval_prompt: 'force'
    });

    return url;
};


googleyoutube.prototype.getToken = function(code) {
    this.oauth2Client.getToken(code, function(err, tokens) {

        if (err) {
            console.log('Error while trying to retrieve access token', err);
            return;
        }
        if(tokens){

            fs.writeFileSync(path.join(__dirname, 'youtubetoken.txt'), JSON.stringify(tokens), 'utf8');

        }

        return tokens;
    });
};

googleyoutube.prototype.refreshToken = function(tokens, callback) {
    var isTokenExpired = false;

    if(tokens){
        var expiryDate = tokens.expiry_date;

        if(expiryDate && expiryDate !== 'undefined') {
            // isTokenExpired = expiryDate ? expiryDate <= (new Date()).getTime() : false;
            isTokenExpired = (expiryDate <= (new Date()).getTime()) ? true : false;
        }

    }
    // если токен не закончился, то возвращаем текущий токен
    if(!isTokenExpired) {
        callback(null, tokens);
        return false;
    }
    // если токен протух, генерируем новый
    this.oauth2Client.setCredentials(tokens);
    this.oauth2Client.refreshAccessToken(function(err, tokens) {
        if(!err){
            if(tokens){

                fs.writeFileSync(path.join(__dirname, 'youtubetoken.txt'), JSON.stringify(tokens), 'utf8');

            }
            callback(null, tokens);
            return tokens;
        }else{
            console.log('Error while trying to get refresh token', err);
            callback(err, null);
            return false;
        }

    });
};

googleyoutube.prototype.searchList = function(params, callback) {
    var tokens = this.fetchTokenFromFile();
    var _this = this;

    this.refreshToken(tokens, function(err, tokens) {
        if(!err) {
            _this.oauth2Client.setCredentials(tokens);

            var youtube = google.youtube({
                version: 'v3',
                auth: _this.oauth2Client
            });

            youtube.search.list(params, function(err, response) {

                if(err){
                    callback(err, null);
                }else{
                    callback(null, response);
                }

            });
        }
    });

};


module.exports = googleyoutube;
