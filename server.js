var express = require('express')
    , bodyParser = require('body-parser')
    , app = express()
    , sync = require('synchronize')
    , cors = require('cors')
    , port = process.env.PORT || 9145;

// Use fibers in all routes so we can use sync.await() to make async code easier to work with.
app.use(function(req, res, next) {
  sync.fiber(next);
});

// Since Mixmax calls this API directly from the client-side, it must be whitelisted.
var corsOptions = {
  origin: /^[^.\s]+\.mixmax\.com$/,
  credentials: true
};

app.get('/', function (req, res) {res.send('iTunes Slash Command for Mixmax');});
app.get('/typeahead', cors(corsOptions), require('./api/typeahead'));
app.get('/resolver', cors(corsOptions), require('./api/resolver'));

app.listen(port, function(err) {
  if (err) {
    // Crash the app if the port is in use, etc.
    throw err;
  }
  console.log('Listening on port %d', port);
  console.log('http://localhost:' + port + '/');
  console.log('http://localhost:' + port + '/typeahead?text=jack');
  console.log('http://localhost:' + port + '/resolver?text=297957761');
});
