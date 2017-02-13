block('lost')(
    content()(
        function() {
           var tweetsResult = this.data.tweetsResult || [];
            return [
                tweetsResult.map(function (tweet) {
                    return {
                        block: 'lost',
                        elem: 'item',
                        js: {
                            id: tweet.id,
                            q: tweet.q
                        },
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
                })
            ];
        }
    )
);
