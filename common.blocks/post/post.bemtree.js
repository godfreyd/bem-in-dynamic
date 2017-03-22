block('post').content()(function() {
    var ctx = this.ctx;
	return [
        {
            elem: 'header',
            content: [
                {
                    block: 'link',
                    mods: { theme: 'islands' },
                    mix: { block: 'post', elem: 'user-name' },
                    target : '_blank',
                    url: ctx.url,
                    content: ctx.name
                },
                {
                    block: 'post',
                    elem: 'time',
                    content: ctx.time
                },
                {
                    block: 'image',
                    mix: { block: 'post', elem: 'user-avatar' },
                    url: ctx.avatar || 'https://raw.githubusercontent.com/bem/bem-identity/master/sign/_theme/sign_theme_captain-america.png',
                    alt: ctx.name
                }

            ]

        },
        {
            elem: 'content',
            elemMods: { type: ctx.service },
            data: ctx
        },
        {
            elem: 'footer',
            content: [
                {
                    block: 'service',
                    mods: { type: ctx.service }
                }
            ]
        }
    ];
});
