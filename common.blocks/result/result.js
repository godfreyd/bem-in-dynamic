modules.define('result', ['i-bem-dom', 'jquery', 'events'], function (provide, bemDom, $, events) {

    provide(bemDom.declBlock(this.name, {
        onSetMod: {
            'js': {
                'inited': function () {

                    this._domEvents(bemDom.win).on('scroll', this._onWinScroll);

                }
            }
        },
        _onWinScroll: function(e) {

            if($(window).scrollTop()+$(window).height() > ($(document).height()-30)){
                console.log('ура! конец страницы!');
                e.preventDefault();
                var event = new events.Event('scroll');
                this._emit(event); // создание БЭМ-события "submit"

            }

        }

    }, {
        lazyInit: true,
        onInit: function() {

        }
    }));
});
