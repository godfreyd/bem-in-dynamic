block('home').content()(function() {
    return [
        {
            block: 'headline'
        },
        {
            block: 'menu',
            mods: { theme : 'tags', mode: 'radio' },
            content: [
                {
                    content: 'bem',
                    val : 'bem',
                },
                {
                    content: 'love',
                    val : 'love',
                },
                {
                    content: 'yandex',
                    val : 'yandex',
                },
                {
                    content: 'iphone',
                    val : 'iphone',
                },
                {
                    content: 'fashion',
                    val : 'fashion',
                }
            ].map(item => ({
                elem : 'item',
                val: item.val,
                content: item.content
            }))
        }
    ];
});

