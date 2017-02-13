modules.define('container', ['i-bem-dom', 'jquery', 'menu', 'form', 'input', 'scroll-btn', 'spin', 'lost'],
    function (provide, bemDom, $, Menu, Form, Input, ScrollBtn, Spin, Lost) {

    provide(bemDom.declBlock(this.name, {

        onSetMod: {
            js: {
                inited: function() {
                    this._spin = this.findChildBlock(Spin);
                    this._menu = this.findChildBlock(Menu);
                }
            }
        },

        _onFormSubmit: function(e) {

            var form = e.bemTarget,
                data = form.findChildBlock(Input).getVal();

            if (!data) {

               return alert('Задан пустой поисковый запрос');

            }

            this._getTweets(data);

            // используем не кэширующий метод
            var item = this._menu.findChildElem({ elem: 'item', modName: 'checked', modVal: true });
            // убираем модификатор checked у item
            if (item) {

                item.delMod('checked');

            }

        },

        _onMenuChange: function(e) {
            this._getTweets(e.bemTarget.getVal());
        },

        _getMoreTweets: function(e) {

            this._lost = this.findChildBlock(Lost);
            var _this = this,
                items = this._lost.findChildElems('item'),
                lastItem = items.get(items.size() - 1),
                maxId = lastItem.params['id'],
                data = lastItem.params['q'];

            var data = data.substring(1); // возвращаем строку без #
            this._spin.setMod('visible');

            $.ajax({
                dataType: 'html',
                url: '/?q=' + data + '&max_id=' + maxId,
                context: this
            }).then(function (res) {
                _this._spin.delMod('visible');
                var items = $(res).children();
                if (items.length === 0) {
                    return alert('По данному запросу больше ничего не найдено!')
                }
                this._append(items);
            }).fail(function (xhr) {
                _this._spin.delMod('visible');
                window.debug && console.log('request fail', xhr);
            });

        },

        _getTweets: function (data) {
            var _this = this;
            this._spin.setMod('visible');

            console.log(data);

            $.ajax({
                dataType: 'html',
                url: '/?q=' + data,
                context: this
            }).then(function (res) {
                _this._spin.delMod('visible');
                var items = $(res).children();
                if (items.length === 0) {
                    return alert('По вашему запросу ничего не найдено!')
                }
                this._update(res);
            }).fail(function (xhr) {
                _this._spin.delMod('visible');
                window.debug && console.log('request fail', xhr);
            });

        },

        _update: function (html) {
            bemDom.update($('.result'), html);
        },

        _append: function (html) {
            bemDom.append($('.lost'), html);
        },

    }, {

        lazyInit: true,
        onInit: function() {
            this._events(Menu).on('change', this.prototype._onMenuChange);
            this._events(Form).on('submit', this.prototype._onFormSubmit);
            this._events(ScrollBtn).on('timeline', this.prototype._getMoreTweets);
            // this._events(Toggle).on({ modName: 'checked', modVal: '*' }, this.prototype._onCheckChange);

        }
    }));
});

