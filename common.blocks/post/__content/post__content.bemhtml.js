// block('post').elem('text')s.tag()('p');
block('post').elem('content')(
    match(function() { return this.ctx.message; })(
        tag()('p'),
        content()(function() {
            return this.ctx.message;
        })
    ),

    match(function() { return this.ctx.video; })(
        replace()(function() {
            return {
                block: 'video',
                mix: { block: 'post', elem: 'text' },
                content: 'апааььюп'
            };
        })
    )
);
