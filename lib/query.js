'use strict'

const config = require('./config')
const url = require('url')

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

/**
 * Execute a query after checkign if criteria are available.
 *
 * @param {String} destination query method
 * @param {Object} criteria parameters to query against
 * @param {Function} callback return results
 * @api private
 */
module.exports = function query (destination, criteria, callback) {
  if (!callback) throw new Error('No callback supplied for: ' + destination)

  // Query against the passed site parameter or the predefined website and construct the endpoint.
  criteria.site = criteria.site || config.get('site')
  const endpoint = url.format({
    protocol: config.get('protocol'),
    host: config.get('api'),
    pathname: '/' + config.get('version') + '/' + destination,
    query: criteria
  });

  // Execute the request on proper response call callback.
  (async () => {
    let body
    try {
      const res = await fetch(endpoint)
      body = await res.json()
    } catch (error) {
      return callback(error)
    }
    return callback(undefined, body)
  })()
}
