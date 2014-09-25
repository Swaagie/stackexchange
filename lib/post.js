'use strict';

var config = require('./config')
  , request = require('request')
  , url = require('url')
  , zlib = require('zlib')
  , Logger = require('devnull')
  , log = new Logger({ timestamp: false });

/**
 * Parse the buffer, StackExchange promises to always deliver zipped content,
 * but since JSON parsing is required just wrap it in a try/catch.
 *
 * @param {Buffer} buffer response content
 * @param {Function} callback return results
 * @api private
 */
function parseBody (buffer, callback) {
  zlib.unzip(buffer, function Unzipped (error, body) {
    try {
      callback(error, JSON.parse(body.toString()));
    } catch (error) {
      callback(error);
    }
  });
}

/**
 * Post a query with supplied data.
 *
 * @param {String} destination query method
 * @param {Object} data parameters to send as a POST form
 * @param {Function} callback return results
 * @api private
 */
module.exports = function post (destination, data, callback) {
  if (!callback) return log.critical('No callback supplied for: ' +  destination);

  // Query against the predefined website and construct the endpoint.
  data.site = config.get('site');
  var endpoint = url.format({
      protocol: config.get('protocol')
    , host: config.get('api')
    , pathname: '/' + config.get('version') + '/' + destination
  });

  // Make a post request on proper response call callback.
  request(
      { url: endpoint, encoding: null, method: "POST", form: data }
    , function response (error, res) {
		if (error) {
			callback(error);
		}
        else {
			parseBody.call(this, res.body, callback);
		}
      }
  );
};
