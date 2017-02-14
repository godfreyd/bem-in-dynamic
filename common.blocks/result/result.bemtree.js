block('result')(
    def()(function() {
        var tweets = this.data.tweets,
        lastTweet = tweets[tweets.length - 1];

        this.ctx.js = {
            maxId: lastTweet.id,
            q: lastTweet.q
        };

        return applyNext();
    }),
    content()(function() {
        return this.data.tweets.map(function(tweet) {
            return {
                block: 'lost',
                elem: 'item',
                content: {
                    block: 'post',
                    name: tweet.name,
                    avatar: tweet.avatar,
                    time: tweet.time,
                    url: tweet.url,
                    message: tweet.message,
                    service: tweet.service
                }
            };
        });
    })
);
