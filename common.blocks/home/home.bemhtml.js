block('home')(
    tag()(function() {
        return this.ctx.tag || 'section';
    }),

    js()(true),

    content()(
        function() {
            return {
                elem: 'inner',
                content: applyNext()
            };
        }
    )
);
