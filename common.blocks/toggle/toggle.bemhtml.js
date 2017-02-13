block('toggle')(
    content()(function() {
        var ctx = this.ctx;

        return [
            {
                elem: 'label',
                attrs: { 'for': this.generateId() },
                content: ctx.text
            },
            {
                elem: 'control',
                attrs: {
                    id: this.generateId(),
                    name: ctx.name,
                    checked : ctx.checked,
                    type: 'checkbox',
                    hidden: 'hidden'
                },
            },
            {
                elem: 'switcher',
                elemMods: { type: ctx.name },
                attrs: { 'for': this.generateId() },
            }
        ];
    }),
    elem('control').tag()('input'),
    elem('label').tag()('label'),
    elem('switcher').tag()('label')
);



