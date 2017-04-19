var Render = require('../render'),
    render = Render.render,
    config = require('../config'),
    moment = require('moment'),
    helpers = require('../helpers'),
    env = process;

function getContent(req, res) {
    var passport = req.session.passport || {};
    env.YOUTUBE_TOKEN || (env.YOUTUBE_TOKEN = passport.user && passport.user.token);

    var query = req.query || {},
        q = query.q ? '#' + query.q : '#bem',
        lang = query.lang || 'en',
        youtube = typeof youtube === 'undefined' ? true : query.youtube,
        twitter = typeof twitter === 'undefined' ? true : query.twitter;

    var youtubeParams = {
        q: q,
        pageToken: query.next_page,
        maxResults: 12,
        relevanceLanguage: lang,
        type: 'video',
        order: 'date',
        part: 'snippet'
    };

    var twitterParams = {
        max_id: query.max_id,
        count: 12,
        lang: lang,
        result_type: 'recent',
        q: q
    };

    var youtubeRequest = youtube ? helpers.youtube(passport.user, youtubeParams) : [],
        twitterRequest = twitter ? helpers.twitter(twitterParams) : [];

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
