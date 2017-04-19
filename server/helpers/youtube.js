var config = require('../config'),
    Youtube = require('../googleyoutube'),
    clientYoutube = new Youtube(config.services.youtube);

function getContent(user, params) {

    var youtubeRequest = new Promise(function(resolve, reject) {

        clientYoutube.searchList(user, params, function(err, data){

            var videos,
                youtube = {};

            if (err) {
                reject(err);
                return;
            }

            videos = data.items.map(function(item) {
                return {
                    name: item.snippet.channelTitle,
                    time: item.snippet.publishedAt, // RFC 3339 formatted date-time
                    q: params.q,
                    nextpage: data.nextPageToken,
                    url: 'https://www.youtube.com/embed/' + item.id.videoId,
                    service: 'youtube'
                };
            });

            youtube.nextPageId = videos[videos.length -1].nextpage;
            youtube.videos = videos;

            resolve(youtube);
        });
    });

    return youtubeRequest;
}

module.exports = {
    getContent
};
