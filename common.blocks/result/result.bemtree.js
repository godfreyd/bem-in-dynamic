block('result')(
    def()(function() {
        var data = this.data;
        this.ctx.js = Object.assign({
            q: data.q,
        }, { maxId: data.maxid }, { nextPage: data.nextpage });

        return applyNext();
    }),
    content()(function() {
        return this.data.result.map(function(item) {
            return {
                block: 'lost',
                elem: 'item',
                content: {
                    block: 'post',
                    name: item.name,
                    avatar: item.avatar,
                    time: item.time,
                    url: item.url,
                    message: item.message,
                    service: item.service
                }
            };
        });
    })
);
// block('result')(
//     def()(function() {
//         var data = this.data,
//             tweets = data.result,
//             lastTweet = tweets[tweets.length - 1]; // Наверное, не совсем верно, справедливо только если данные из YouTube в начале

//         this.ctx.js = Object.assign({
//             q: data.q,
//         }, lastTweet ? { maxId: lastTweet.id } : {}, { nextpage: data.nextpage });

//         return applyNext();
//     }),
//     content()(function() {
//         return this.data.result.map(function(item) {
//             return {
//                 block: 'lost',
//                 elem: 'item',
//                 content: {
//                     block: 'post',
//                     name: item.name,
//                     avatar: item.avatar,
//                     time: item.time,
//                     url: item.url,
//                     nextpage: item.nextpage,
//                     message: item.message,
//                     service: item.service
//                 }
//             };
//         });
//     })
// );

