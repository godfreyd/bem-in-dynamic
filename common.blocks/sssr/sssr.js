modules.define('sssr', ['i-bem-dom', 'jquery', 'menu', 'form', 'input', 'spin', 'result'],
    function (provide, bemDom, $, Menu, Form, Input, Spin, Result) {

    provide(bemDom.declBlock(this.name, {

        onSetMod: {
            js: {
                inited: function() {
                    this._spin = this.findChildBlock(Spin);
                    this._menu = this.findChildBlock(Menu);
                    this._result = this.findChildBlock(Result);

                    // меняется в рантайме
                    this._params = Object.assign({}, this._result.params);
                }
            }
        },

        _onFormSubmit: function(e) {
            var form = e.bemTarget,
                data = form.findChildBlock(Input).getVal();

            if (!data) {
               return alert('Please fill in search query');
            }

            // используем не кэширующий метод
            var item = this._menu.findChildElem({ elem: 'item', modName: 'checked', modVal: true });
            if (item) {
                item.delMod('checked');
            }

            this._getTweets(data);
        },

        _onMenuChange: function(e) {
            this._getTweets(e.bemTarget.getVal());
        },

        _getTweets: function(query) {
            if (typeof query === 'object') {
                query = null;
            }

            var _this = this,
                params = this._params,
                q = params.q.substring(1),
                maxId = !query && params.maxId;

            query || (query = q);

            this._spin.setMod('visible');

            $.ajax({
                url: '/?q=' + query + (maxId ? '&max_id=' + maxId : ''),
            }).then(function(res) {
                _this._spin.delMod('visible');
                var items = $(res).children();

                if (items.length === 0) {
                    // TODO: прятать scroll-btn
                    return alert('По данному запросу больше ничего не найдено!')
                }

                _this._params = $(res).bem(Result).params;

                bemDom[maxId ? 'append' : 'update'](_this._result.domElem, items);
            }).fail(function (xhr) {
                _this._spin.delMod('visible');
                window.debug && console.log('request failed', xhr);
            });
        }
    }, {

        lazyInit: true,
        onInit: function() {
            this._events(Menu).on('change', this.prototype._onMenuChange);
            this._events(Form).on('submit', this.prototype._onFormSubmit);
            this._events('more').on('click', this.prototype._getTweets);

            // this._events(Toggle).on({ modName: 'checked', modVal: '*' }, this.prototype._onCheckChange);

        }
    }));
});

