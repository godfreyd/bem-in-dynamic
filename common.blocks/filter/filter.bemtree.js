block('filter').replace()(function() {
    return [
        {
            name: 'youtube',
            title: 'YouTube',
            checked: true
        },
        {
            name: 'twitter',
            title: 'Twitter',
            checked: true
        }
    ].map(item => ({
        block: 'checkbox',
        mix: { block: this.block, elem: 'service', elemMods: { type: item.name } },
        mods: { theme: 'toggle', checked: item.checked },
        name: item.name,
        val: item.name,
        text: item.title
    }));
});
