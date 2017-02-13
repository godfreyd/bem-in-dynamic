modules.define('home', ['i-bem-dom'], function (provide, bemDom) {

    provide(bemDom.declBlock(this.name, {
        onSetMod: {
            'js': {
                'inited': function () {

                    var home = this;

                    setTimeout(function() {
                        home.delMod('full');
                        home.setMod('transition-height', true);
                    }, 1000);

                }
            }
        },

    }));
});
