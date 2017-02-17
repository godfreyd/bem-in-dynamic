[{
    shouldDeps: [
        'header',
        { block: 'main', mods: { full: true } },
        'result',
        'not-result',
        'footer',
        { block: 'menu', mods: { theme: 'tags' } }
    ]
},
{
    tech: 'js',
    shouldDeps: [
        { block: 'not-result', tech: 'bemhtml' }
    ]
}]
