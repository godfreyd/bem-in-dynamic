var google = require('googleapis'),
    OAuth2 = google.auth.OAuth2;

function GoogleYoutube(credentials) {
    this.oauth2Client = new OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_url);
};

GoogleYoutube.prototype.searchList = function(user, params, callback) {
    this.oauth2Client.setCredentials({
        access_token: user.token,
        refresh_token: user.refreshtoken
    });

    var youtube = google.youtube({
        version: 'v3',
        auth: this.oauth2Client
    });

    youtube.search.list(params, function(err, response) {
        err ? callback(err, null) : callback(null, response);
    });
};

module.exports = function(config, user, params) {
    return new Promise(function(resolve, reject) {
        (new GoogleYoutube(config)).searchList(user, params, function(err, data) {
            if (err) return reject(err);

            if (!data.items.length) return resolve({});

            resolve({
                nextPageId: data.items[data.items.length -1].nextPageToken,
                videos: data.items.map(function(item) {
                    return {
                        name: item.snippet.channelTitle,
                        time: item.snippet.publishedAt, // RFC 3339 formatted date-time
                        q: params.q,
                        nextpage: data.nextPageToken,
                        url: 'https://www.youtube.com/embed/' + item.id.videoId,
                        service: 'youtube'
                    };
                })
            });
        });
    });
};
