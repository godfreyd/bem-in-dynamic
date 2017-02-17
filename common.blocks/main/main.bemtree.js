block('main').content()(function() {
    return [
        {
            block: 'headline'
        },
        {
            block: 'menu',
            mods: { theme: 'tags', mode: 'radio-check' },
            val: 'bem',
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

