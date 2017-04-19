var Render = require('../render'),
    render = Render.render,
    config = require('../config'),
    moment = require('moment'),
    helpers = require('../helpers'),
    env = process.env;

function getContent(req, res) {
    var passport = req.session.passport || {},
        servicesYouTube = config.services.youtube,
        servicesTwitter = config.services.twitter;

    env.YOUTUBE_APP_ID || (env.YOUTUBE_APP_ID = servicesYouTube.client_id);
    env.YOUTUBE_APP_SECRET || (env.YOUTUBE_APP_SECRET = servicesYouTube.client_secret);

    var query = req.query || {},
        q = query.q ? '#' + query.q : '#bem',
        lang = query.lang || 'en',
        count = query.count || 12,
        youtube = typeof youtube === 'undefined' && !req.xhr ? true : query.youtube,
        twitter = typeof twitter === 'undefined' && !req.xhr ? true : query.twitter;

    var youtubeParams = {
        q: q,
        pageToken: query.next_page,
        maxResults: count,
        relevanceLanguage: lang,
        type: 'video',
        order: 'date',
        part: 'snippet'
    };

    var twitterParams = {
        max_id: query.max_id,
        count: count,
        lang: lang,
        result_type: 'recent',
        q: q
    };

    var youtubeRequest = youtube ? helpers.youtube(servicesYouTube, passport.user, youtubeParams) : [],
        twitterRequest = twitter ? helpers.twitter(servicesTwitter, twitterParams) : [];

    Promise.all([youtubeRequest, twitterRequest]).then(function(results) {
        var youtubeResults = results[0],
            twitterResults = results[1],
            results = (youtubeResults.videos || []).concat(twitterResults.tweets || [])
                .sort(function(a, b) {
                    return +new Date(b.time) - +new Date(a.time);
                })
                .map(function(item) {
                    item.time = moment(item.time).fromNow();
                    return item;
                });

        render(req, res, {
            view: 'index',
            title: 'Social Services Search Robot',
            meta: {
                description: 'With the Social Services Search Robot you can find the latest tweets and videos',
                og: {
                    url: 'http://localhost:3000',
                    siteName: 'BEM'
                }
            },
            q: q,
            user: passport.user,
            maxid: twitterResults.nextPageId,
            nextpage: youtubeResults.nextPageId,
            result: results
        }, req.xhr && { block: 'result' });

    }).catch(function(err) {
        console.log(err);
        res.status(500);
        render(req, res, {
            view: '500'
        });
    });
}

module.exports = {
    getContent
};
