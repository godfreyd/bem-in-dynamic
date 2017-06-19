var Twitter = require('twitter');

module.exports = function getContent(config, params) {
    return new Promise(function(resolve, reject) {
        new Twitter(config).get('search/tweets', params, function(err, data) {
            if (err) return reject(err);
            if(!data.statuses.length) return resolve({});

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
