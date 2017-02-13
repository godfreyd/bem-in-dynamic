block('footer')(
    tag()('footer'),

    elem('columns').tag()('ul'),
    elem('sourse')(
        tag()('li'),
        content()(function() {
            return {
                elem: 'sourse-link',
                attrs: { href: this.ctx.url, target: '_blank'},
                content: applyNext()
            };
        })
    ),
    elem('sourse-link').tag()('a')
);
