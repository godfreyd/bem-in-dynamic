block('post').elem('content').elemMod('type', 'youtube').content()(function() {

    return [
        {
            tag: 'iframe',
            attrs: { width: '280', height: '120', src: this.ctx.data.url, frameborder: 0, allowfullscreen: true}
        }
    ];

});
