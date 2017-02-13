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
        block: 'toggle',
        mods: { type: item.name },
        text: item.title,
        name: item.name,
        checked: item.checked
    }));

});
