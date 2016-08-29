var util = require('../util/utils')
    , sync = require('synchronize')
    , request = require('request')
    , _ = require('underscore');


// The API that returns the in-email representation.
module.exports = function(req, res) {

    if (!req.query.text) {
        res.status(500).send('Error');
        return;
    }

    var trackId = req.query.text.trim();

    if (util.isInteger(Number(trackId))) {
        // If Track was returned correctly
        handleIdString(trackId, req, res);
    } else {
        // Track was NOT returned correctly
        // Else, if the user was typing fast and press enter before the /typeahead API can respond,
        // Mixmax will just send the text to the /resolver API (for performance). Handle that here.
        handleSearchString(req, res);
    }
};

function handleIdString(trackId, req, res) {
    var response;
    try {
        response = sync.await(request({
            url: 'https://itunes.apple.com/lookup?id=' + encodeURIComponent(trackId),
            qs: {
            },
            json: true,
            timeout: 15 * 1000
        }, sync.defer()));
    } catch (e) {
        res.status(500).send('Error');
        return;
    }

    if (response.statusCode !== 200 || !response.body || !response.body.results) {
        res.status(500).send('Error');
        return;
    }

    resolver(response.body.results, req, res);
}

function handleSearchString(req, res) {

    var response;
    try {
        response = sync.await(request({
            url: 'https://itunes.apple.com/search',
            qs: {
                term: util.randomActs(), // random act search
                limit: 15
            },
            json: true,
            timeout: 15 * 1000
        }, sync.defer()));
    } catch (e) {
        res.status(500).send('Error');
        return;
    }

    if (response.statusCode !== 200 || !response.body || !response.body.results) {
        res.status(500).send('Error');
        return;
    }

    var resp = [_.sample(response.body.results)]; // slice and resolve as new array.
    resolver(resp, req, res);
}

function resolver(data, req, res) {
    var results = _.chain(data)
        .reject(function(entry) {
            return !entry || !entry.artistName || !entry.previewUrl;
        })
        .map(function(entry) {

            var image = entry['artworkUrl100'];
            var title = entry['trackName'];
            var artist = entry['artistName'];
            var collection = entry['collectionName'];
            var preview = entry['previewUrl'];

            var html = '<div style="border: 2px solid #2956C6;">' +
                '<div style="width: 100px; display:inline-block; padding:4px;">' +
                '<a href="' + preview + '">' +
                '<img style="max-width:100%;" src="' + image + '" width="100px"/>' +
                '</a>' +
                '</div>' +
                '<div style="display:inline-block; vertical-align:top;">' +
                '<h4>' + title + '</h4>' +
                '<p> by ' + artist + ' on the ' + collection + '. <a href="' + preview + '">play</a></p>' +
                '</div></div>';

            return {
                body: html
            };
        })
        .value();

    if (results.length === 0) {
        res.json([{
            body: '<i>(no results)</i>'
        }]);
    } else {
        res.json(results);
    }
}