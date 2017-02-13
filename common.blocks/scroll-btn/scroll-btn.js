modules.define('scroll-btn', ['i-bem-dom', 'events'], function (provide, bemDom, events) {

    provide(bemDom.declBlock(this.name, {
        onSetMod: {
            'js': {
                'inited': function () {

					var btn = this;

					setTimeout(function() { btn.setMod('enabled', true); }, 2000);

                    btn._domEvents().on('click', btn._onClick);

                }
            }
        },
        _onClick : function() {

            var event = new events.Event('timeline');
            this._emit(event); // создание БЭМ-события "submit"

        }

    }));
});
