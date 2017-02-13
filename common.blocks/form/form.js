modules.define('form', ['i-bem-dom', 'events'], function (provide, bemDom, events) {

    provide(bemDom.declBlock(this.name, {

        _onSubmit: function(e) {
            e.preventDefault();
            var event = new events.Event('submit');
            this._emit(event); // создание БЭМ-события "submit"
        }

    },
    {
        lazyInit: true,
        onInit: function() {
            this._domEvents().on('submit', this.prototype._onSubmit);
        }
    }

    ));
});
