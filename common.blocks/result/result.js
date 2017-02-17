modules.define('result', ['i-bem-dom', 'functions__throttle'], function(provide, bemDom, throttle) {

    provide(bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function () {

                    this._domEvents(bemDom.win).on('scroll', throttle(this._onWinScroll, 500, this));

                }
            }
        },

        _onWinScroll: function() {
            const resultOffset = bemDom.doc.height() - 30;
            const pageEnd = bemDom.win.scrollTop() + bemDom.win.height() > resultOffset;

            if (pageEnd) {
                this._emit('scroll');
            }
        }

    }));
});
