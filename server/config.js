"use strict";

module.exports = {
    staticFolder: 'static',
    defaultPort: 3000,
    cacheTTL: 30000,
    sessionSecret: 'REPLACE_ME_WITH_RANDOM_STRING',
    services: {
        twitter: {
            consumer_key: 'cHdgKbwT6gNKw3oSIlfoXm9gQ',
            consumer_secret: 'kZwxUcqH7nRjy4FLKMnKDwJlyeDgawnXSiK3CuoEAyG6wh8OZr',
            access_token_key: '308396397-ZHSV7obGdaACXlEGRfRQ9qGS6zdcSIyMrNKlugSr',
            access_token_secret: 'MQvl2hBHK1NeCYbcCD0AmlyD3s1Rbqb1dJGTjVpNDG4GH'
        },
        youtube: {
            client_id: '601807235520-oghq1ged5d6441bo4q23mtb8kaej97dd.apps.googleusercontent.com',
            client_secret: 'i1qM4Q2j80ZvDqo0TvMtjMje',
            redirect_url: 'http://localhost:3000'
        }
    }
};
