block('post').elem('content').elemMod('type', 'youtube').content()(function() {

    var data = this.data;

    return [
        {
            block: 'link',
            mods: { theme : 'islands', size : 'm' },
            url: data.video,
            content: 'Video'
        }
    ]

});
