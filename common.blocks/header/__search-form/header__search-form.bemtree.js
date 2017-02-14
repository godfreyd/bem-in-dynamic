block('header').elem('search-form').replace()(function() {
    return {
        block: 'form',
        mix: { block: this.block, elem: this.elem },
        content: [
            {
                block: 'control-group',
                content: [
                    {
                        block: 'input',
                        mods: { theme: 'islands', size: 'l', 'has-clear': true, type: 'search' },
                        val: this.data.tweets[0].q.substr(1)
                    },
                    {
                        block: 'button',
                        mods: { theme: 'islands', size: 'l', type: 'submit' },
                        text: 'Search'
                    }
                ]
            },
            {
                block: this.block,
                elem: 'filter'
            },
            {
                block: 'spin',
                mods: { theme: 'islands', size: 's' }
            }
        ]
    };
});

