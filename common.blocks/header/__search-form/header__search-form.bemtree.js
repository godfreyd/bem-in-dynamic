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
                        name: 'query',
                        val: this.data.result[0].q.substr(1)
                    },
                    {
                        block: 'button',
                        mods: { theme: 'islands', size: 'l', type: 'submit' },
                        text: 'Search'
                    }
                ]
            },
            {
                block: 'filter'
            },
            {
                block: 'spin',
                mods: { theme: 'islands', size: 's' }
            }
        ]
    };
});

