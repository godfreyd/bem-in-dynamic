modules.define('sssr', ['i-bem-dom', 'jquery', 'menu', 'form', 'input', 'checkbox', 'spin', 'result', 'BEMHTML'],
    function(provide, bemDom, $, Menu, Form, Input, Checkbox, Spin, Result, BEMHTML) {

    provide(bemDom.declBlock(this.name, {

        onSetMod: {
            js: {
                inited: function() {
                    this._spin = this.findChildBlock(Spin);
                    this._menu = this.findChildBlock(Menu);
                    this._result = this.findChildBlock(Result);
                    this._form = this.findChildBlock(Form);
                    // меняется в рантайме
                    this._params = Object.assign({}, this._result.params);
                }
            }
        },

        _onChange: function() {
            this._getTweets();
        },

        _onScroll: function() {
            this._getTweets({ isScroll: true });
        },

        _onMenuChange: function(e) {
            var val = e.bemTarget.getVal();

            val && this._form.findChildBlock(Input).setVal(val);
        },

        _renderNoResults: function() {
            bemDom.update(this._result.domElem, BEMHTML.apply({ block: 'not-result' }));
        },

        _getTweets: function(opts) {
            opts || (opts = {});

            var _this = this,
                params = this._params,
                data = this._form.serializeToJson(),
                query = data.query,
                maxId = opts.isScroll && params.maxId,
                nextPage = opts.isScroll && params.nextPage,
                possibleValues = this._menu.getItems().map(function(item) {
                    return item.getVal();
                });

                console.log(params);

            this._menu.setVal(possibleValues.indexOf(query) > -1 ? query : undefined);
            this._result.setMod('active', !!data.twitter);

            if (!query || !data.twitter || !data.youtube) {
                return this._renderNoResults();
            }

            this._spin.setMod('visible');

            // TODO: иногда дублируется запрос с старым maxId
            // console.log('====>', '/?q=' + query + (maxId ? '&max_id=' + maxId : ''));

            $.ajax({
                url: '/?q=' + query + (maxId ? '&max_id=' + maxId : '') + (nextPage ? '&next_page=' + nextPage : ''),
            }).then(function(res) {
                _this._spin.delMod('visible');
                var items = $(res).children();

                _this._params = $(res).bem(Result).params;

                if (items.length === 0) {
                    return _this._renderNoResults();
                }

                bemDom[maxId ? 'append' : 'update'](_this._result.domElem, items);
            }).fail(function (xhr) {
                _this._spin.delMod('visible');
                window.debug && console.log('request failed', xhr);
            });
        }

    }, {

        lazyInit: true,
        onInit: function() {
            var ptp = this.prototype;
            // TODO: подписываться точечно
            this._events(Menu).on('change', ptp._onMenuChange);
            this._events(Input).on('change', ptp._onChange);
            this._events(Result).on('scroll', ptp._onScroll);
            this._events(Checkbox).on({ modName : 'checked', modVal : '*' }, ptp._onChange);
        }
    }));
});

