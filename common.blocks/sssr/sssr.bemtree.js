block('sssr').content()(function() {
    return [
        {
            block: 'header'
        },
        {
            block: 'main',
            mods: { full: true }
        },
        {
            block: 'result',
            mix: { block: 'lost'}
        },
        {
            block: 'footer'
        }
    ];
});
