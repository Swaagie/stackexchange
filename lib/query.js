'use strict';

var config = require('./config')
  , fetch = require('node-fetch')
  , url = require('url');

/**
 * Execute a query after checkign if criteria are available.
 *
 * @param {String} destination query method
 * @param {Object} criteria parameters to query against
 * @param {Function} callback return results
 * @api private
 */
module.exports = function query (destination, criteria, callback) {
  if (!callback) throw new Error('No callback supplied for: ' +  destination);

  // Query against the passed site parameter or the predefined website and construct the endpoint.
  criteria.site = criteria.site || config.get('site');
  var endpoint = url.format({
      protocol: config.get('protocol')
    , host: config.get('api')
    , pathname: '/' + config.get('version') + '/' + destination
    , query: criteria
  });

  // Execute the request on proper response call callback.
  fetch(endpoint)
    .then((res) => res.json())
    .then((body) => callback(undefined, body))
    .catch((error) => { callback(error); });
};
