modules.define('result', ['i-bem-dom', 'functions__throttle'], function(provide, bemDom, throttle) {

    provide(bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function () {
                    this._onWinScroll = throttle(this._onWinScroll, 500, this);
                    this.setMod('active');
                }
            },
            active: {
                'true': function() {
                    this._domEvents(bemDom.win).on('scroll', this._onWinScroll);
                },
                '': function() {
                    this._domEvents(bemDom.win).un('scroll', this._onWinScroll);
                }
            }
        },
        _onWinScroll: function() {
            var resultOffset = bemDom.doc.height() - 30,
                pageEnd = bemDom.win.scrollTop() + bemDom.win.height() > resultOffset;

            pageEnd && this._emit('scroll');
        }
    }));
});
