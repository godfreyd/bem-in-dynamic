modules.define('sssr__more', ['i-bem-dom'], function (provide, bemDom) {

    provide(bemDom.declElem('sssr', 'more', {
        _onClick : function() {
            this._emit('click');
        }

    }, {
        lazyInit: true,
        onInit: function() {
            this._domEvents().on('click', this.prototype._onClick);
        }
    }));
});
