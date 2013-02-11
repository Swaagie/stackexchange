'use strict';

var nconf = require('nconf');

// Default configuration.
nconf.use('memory').defaults({
    api: 'api.stackexchange.com'
  , protocol: 'http:'
  , site: 'stackoverflow'
  , version: 2.1
});

// Expose config
module.exports = nconf;
