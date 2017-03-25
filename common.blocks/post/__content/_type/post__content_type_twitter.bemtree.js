block('post').elem('content').elemMod('type', 'twitter').content()(function() {

    var data = this.ctx.data;

    return data.message;

});
