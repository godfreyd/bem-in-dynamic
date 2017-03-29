block('result')(
    def()(function() {
        var data = this.data;
        this.ctx.js = {
            q: data.q,
            maxId: data.maxid,
            nextPage: data.nextpage
        };

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
