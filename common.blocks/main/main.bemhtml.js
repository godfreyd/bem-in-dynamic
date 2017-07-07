block('main')(
    tag()(function() {
        return this.ctx.tag || 'section';
    }),
    addJs()(true),
    content()(function() {
        return {
            elem: 'inner',
            content: applyNext()
        };
    })
);
