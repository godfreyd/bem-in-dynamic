var config = require('../config'),
    Twitter = require('twitter'),
    clientTwitter = new Twitter(config.services.twitter);

module.exports = function getContent(params) {
    return new Promise(function(resolve, reject) {
        clientTwitter.get('search/tweets', params, function(err, data) {
            if (err) return reject(err);

            resolve({
                nextPageId: data.statuses[data.statuses.length -1].id,
                tweets: data.statuses.map(function(item) {
                    var user = item.user;

                    return {
                        name: user.name,
                        time: item.created_at, // UTC time
                        q: params.q,
                        id: item.id,
                        url: 'https://twitter.com/' + user.screen_name + '/status/' + item.id_str,
                        avatar: user.profile_image_url,
                        message: item.text,
                        service: 'twitter'
                    };
                })
            });
        });
    });
};
