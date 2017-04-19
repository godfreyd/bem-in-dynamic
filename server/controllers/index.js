var Render = require('../render'),
    render = Render.render,
    config = require('../config'),
    moment = require('moment'),
    helpers = require('../helpers'),
    env = process;

function getContent(req, res) {

    var passport = req.session.passport || {};
    env.YOUTUBE_TOKEN || (env.YOUTUBE_TOKEN = passport.user && passport.user.token);

    var query = req.query,
        q = query.q ? '#' + query.q : '#bem',
        youtube = query.youtube,
        twitter = query.twitter;

    var youtubeParams = {
        q: q,
        pageToken: query && query.next_page,
        maxResults: 12,
        relevanceLanguage: 'en',
        type: 'video',
        order: 'date',
        part: 'snippet'
    };

    var twitterParams = {
        max_id: query && query.max_id,
        count: 12,
        lang: 'en',
        result_type: 'recent',
        q: q
    };

    if (req.xhr) {

        if (youtube) {

            var youtubeRequest = helpers.youtube.getContent(passport.user, youtubeParams);
        }

        if (twitter) {
            var twitterRequest =  helpers.twitter.getContent(twitterParams);
        }

    } else {

        var youtubeRequest = helpers.youtube.getContent(passport.user, youtubeParams);
        var twitterRequest = helpers.twitter.getContent(twitterParams);
    }

    Promise.all([youtubeRequest, twitterRequest]).then(function(results) {

        if (results[0] !== undefined) {

            var youtube = results[0],
                youtubeNextPageId = youtube.nextPageId,
                videos = youtube.videos;
        }

        if (results[1] !== undefined) {

            var twitter = results[1],
                twitterNextPageId = twitter.nextPageId,
                tweets = twitter.tweets;
        }

        if (videos && tweets) {

            var  results = videos.concat(tweets);

        } else {

            var  results = videos ? videos : tweets;
        }

        results
            .forEach(function(item) {
                item.time = +new Date(item.time);
            });
        results
            .sort(function compareTime(itemA, itemB) {
                return itemB.time - itemA.time;
            })
            .forEach(function(item) {
                item.time = moment(item.time).fromNow();
            });

        render(req, res, {
            view: 'index',
            title: 'Social Services Search Robot',
            meta: {
                description: 'With the Social Services Search Robot, you can find the latest tweets and videos.',
                og: {
                    url: 'http://localhost:3000',
                    siteName: 'BEM'
                }
            },
            q: q,
            user: passport.user,
            maxid: twitterNextPageId,
            nextpage: youtubeNextPageId,
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
