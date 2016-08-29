var util = require('../util/utils')
    , sync = require('synchronize')
    , request = require('request')
    , _ = require('underscore');

// The Type Ahead API.
module.exports = function(req, res) {

    if (!req.query.text) {
        res.json([{
            title: '<i>(enter a search term)</i>',
            text: ''
        }]);
        return;
    }

    var term = req.query.text.trim();

    var response;
    try {
        response = sync.await(request({
            url: 'https://itunes.apple.com/search',
            qs: {
                term: term,
                limit: 15
            },
            gzip: true,
            json: true,
            timeout: 10 * 1000
        }, sync.defer()));
    } catch (e) {
        res.status(500).send('Error');
        return;
    }

    if (response.statusCode !== 200 || !response.body || !response.body.results) {
        res.status(500).send('Error');
        return;
    }

    var results = _.chain(response.body.results)
        .reject(function(entry) {
            return !entry || !entry.trackName || !entry.artistName;
        })
        .map(function(entry) {
            return {
                title: entry.trackName + ' by ' + entry.artistName,
                text: entry.trackId
            };
        })
        .value();

    if (results.length === 0) {
        res.json([{
            title: '<i>(no results)</i>',
            text: ''
        }]);
    } else {
        res.json(results);
    }
};
