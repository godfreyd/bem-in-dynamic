block('post').elem('content').elemMod('type', 'twitter').content()(function() {

    var data = this.data;

    return data.message;

});
