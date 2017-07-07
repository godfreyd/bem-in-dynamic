block('result')(
    tag()(function() {
        return this.ctx.tag || 'section';
    }),
    addJs()(true)
);
