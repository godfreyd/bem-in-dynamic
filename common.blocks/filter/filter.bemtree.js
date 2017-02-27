block('filter').replace()(function() {
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
        mix: { block: this.block, elem: 'service', elemMods: { type: item.name } },
        mods: { checked: item.checked },
        name: item.name,
        val: item.name,
        text: item.title
    }));
});
