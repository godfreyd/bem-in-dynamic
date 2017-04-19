var config = require('../config'),
    Twitter = require('twitter'),
    clientTwitter = new Twitter(config.services.twitter);

function getContent(params) {

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

module.exports = {
    getContent
};
