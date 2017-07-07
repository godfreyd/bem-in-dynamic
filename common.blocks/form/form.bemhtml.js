block('form')(
    tag()('form'),
    addJs()(true),
    addAttrs()(function() {
        var ctx = this.ctx;

        return {
            method: ctx.method,
            action: ctx.action || '/'
        };
    })
);

