block('post').elem('content').elemMod('type', 'youtube').content()(function() {

    var data = this.ctx.data;

    return [
        {
            tag: 'iframe',
            attrs: { width: '280', height: '120', src: data.url, frameborder: 0, allowfullscreen: true}
        }
    ];

});
