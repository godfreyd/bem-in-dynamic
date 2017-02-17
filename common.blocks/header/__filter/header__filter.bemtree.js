block('header').elem('filter').replace()(function() {
    return [
        {
            name: 'instagram',
            title: 'Instagram',
            checked: false
        },
        {
            name: 'twitter',
            title: 'Twitter',
            checked: true
        }
    ].map(item => ({
        block: 'checkbox',
        mix: { block: this.block, elem: this.elem },
        mods: { type: item.name, checked: item.checked },
        name: item.name,
        val: item.name,
        text: item.title
    }));
});
