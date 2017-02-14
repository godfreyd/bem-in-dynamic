block('headline').content()(function() {
    return [
        {
            block: 'heading',
            mix: { block: 'headline', elem: 'title'},
            mods: { level: 2 },
            content: 'Social Services Search Robot'
        },
        {
            block: 'heading',
            mix: { block: 'headline', elem: 'subtitle'},
            mods: { level: 5 },
            content: 'Most Popular Hashtags'
        }
    ];
});
