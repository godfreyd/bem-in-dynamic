block('main').content()(function() {
    return [
        {
            block: 'headline'
        },
        {
            block: 'menu',
            mods: { theme: 'tags', mode: 'radio' },
            content: [
                'bem',
                'love',
                'yandex',
                'iphone',
                'fashion'
            ].map(item => ({
                elem: 'item',
                val: item,
                content: item
            }))
        }
    ];
});

