modules.define('main', ['i-bem-dom'], function (provide, bemDom) {

    provide(bemDom.declBlock(this.name, {
        onSetMod: {
            js: {
                inited: function () {
                    var _this = this;

                    setTimeout(function() {
                        _this
                            .delMod('full')
                            .setMod('transition-height', true);
                    }, 1000);
                }
            }
        },

    }));
});
