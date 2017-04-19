var google = require('googleapis'),
    OAuth2 = google.auth.OAuth2;

function GoogleYoutube(credentials) {
    this.oauth2Client = new OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_url);
};

GoogleYoutube.prototype.searchList = function(user, params, callback) {

    this.oauth2Client.setCredentials({
      access_token: user.token,
      refresh_token: user.refreshtoken,
      expiry_date: true
    });

    var youtube = google.youtube({
        version: 'v3',
        auth: this.oauth2Client
    });

    youtube.search.list(params, function(err, response) {
        err ? callback(err, null) : callback(null, response);
    });
};

module.exports = GoogleYoutube;
