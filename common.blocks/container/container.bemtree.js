block('container').content()(function() {
    return [
        {
            block: 'header'
        },
        {
            block: 'home',
            mods: { full: true }
        },
        {
            block: 'result'
        },
        {
            block: 'scroll-btn',
            mods: {'scroll': true, 'at-start': true }
        },
        {
            block: 'footer'
        }
    ];
});
