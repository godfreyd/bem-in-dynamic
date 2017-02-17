modules.define('sssr', ['i-bem-dom', 'jquery', 'menu', 'form', 'input', 'checkbox', 'spin', 'result', 'BEMHTML'],
    function(provide, bemDom, $, Menu, Form, Input, Checkbox, Spin, Result, BEMHTML) {

    var undef;

    provide(bemDom.declBlock(this.name, {

        onSetMod: {
            js: {
                inited: function() {
                    this._spin = this.findChildBlock(Spin);
                    this._menu = this.findChildBlock(Menu);
                    this._result = this.findChildBlock(Result);
                    this._form = this.findChildBlock(Form);
                    this._checkboxes = undef;
                    // меняется в рантайме
                    this._params = Object.assign({}, this._result.params);

                }
            }
        },

        _onFormSubmit: function(e) {
            var form = e.bemTarget,
                data = form.findChildBlock(Input).getVal(); // TODO: может заменить на this._form.findChildBlock(Input).getVal();

            if (!data) {
               return alert('Please fill in search query');
            }

            // используем не кэширующий метод
            var item = this._menu.findChildElem({ elem: 'item', modName: 'checked', modVal: true });
            if (item) {
                item.delMod('checked');
            }

            this._getTweets(data, this._getServices());
        },

        _onMenuChange: function(e) {

            this._getTweets(e.bemTarget.getVal(), this._getServices());

        },

        _getServices: function(e) {

            var services = this._onCheckboxCheck(); // get {Array[checkbox]}

            if (services.length === 0) {

               alert('Choose Social Service');  // TODO: не переключать модификатор checked
               return false;
            }

           return services;

        },

        _updateDOM: function(array) {

            var twitter = this._findservice(array, 'twitter');
            var instagram = this._findservice(array, 'instagram');

            // TODO: правильно апдейтить

            if(twitter === -1) {

                var html = BEMHTML.apply({ block: 'not-result' });
                bemDom.update($('.result'), html);

            } else {

                this._getTweets(this._form.findChildBlock(Input).getVal(), array);

            }

        },

        _findservice: function(array, value) {

            // проверяем поддерживает ли браузер indexOf
            if ([].indexOf) {
                var find = function(array, value) {
                    return array.indexOf(value);
                }

            } else {
                var find = function(array, value) {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] === value) return i;

                    }
                return -1;
              }

            }

            return find(array, value);
        },

        /**
         * Returns checkboxes
         * @returns {Array[checkbox]}
         */
        getCheckboxes: function() {
            return this._checkboxes || (this._checkboxes = this.findChildBlocks(Checkbox));
        },

        _extractVal: function() {
            return this.getCheckboxes()
                .filter(function(checkbox) {
                    return checkbox.hasMod('checked');
                })
                .map(function(checkbox) {
                    return checkbox.getVal();
                });
        },

        _onCheckboxCheck: function() {
            if(!this._inSetVal) {
                var val = this._extractVal();
            }
            this._updateDOM(val);
            return val;

        },

        /**
         * Returns tweets
         * @update or append block result
         */
        _getTweets: function(query, services) {
            if (typeof query === 'object') {
                query = null;
            }

            // TODO: сделать проверку {Array[services]},
            // если твиттер - ищем по твиттеру,
            // если инстаграм - ищем по инстаграму
            // если оба - ищем по обоим сервисам


            var _this = this,
                params = this._params,
                q = params.q.substring(1),
                maxId = !query && params.maxId;

            query || (query = q);

            this._spin.setMod('visible');
            this._form.findChildBlock(Input).setVal(query); // TODO: не обновлять при _onFormSubmit

            $.ajax({
                url: '/?q=' + query + (maxId ? '&max_id=' + maxId : ''),
            }).then(function(res) {
                _this._spin.delMod('visible');
                var items = $(res).children();

                _this._params = $(res).bem(Result).params;

                if (items.length === 0) {
                    return alert('No more results for ' + _this._params.q.substring(1) + '.');
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
            this._events(Menu).on('change', ptp._onMenuChange);
            this._events(Form).on('submit', ptp._onFormSubmit);
            this._events(Result).on('scroll', ptp._getTweets); // TODO: при скроле учитывать checkbox
            this._events(Checkbox).on({ modName : 'checked', modVal : '*' }, ptp._onCheckboxCheck);
        }
    }));
});

