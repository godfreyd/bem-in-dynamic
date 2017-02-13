block('form')(
    tag()('form'),
    js()(true),
    attrs()(function() {
        var ctx = this.ctx;

        return {
            method: ctx.method,
            action: ctx.action || '/'
        };
    })
);

