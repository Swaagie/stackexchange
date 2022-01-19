'use strict'

const config = require('./config')
const parser = require('./parser')
const url = require('url')

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

/**
 * Post a query with supplied data.
 *
 * @param {String} destination query method
 * @param {Object} data parameters to send as a POST form
 * @param {Function} callback return results
 * @api private
 */
module.exports = function post (destination, data, callback) {
  if (!callback) throw new Error('No callback supplied for: ' + destination)

  data.site = config.get('site')
  const endpoint = `${config.get('protocol')}//${config.get('api')}/${config.get('version')}/${destination}`

  const params = new url.URLSearchParams()
  for (const key in data) {
    params.append(key, data[key])
  }

  fetch(endpoint, { method: 'POST', body: params })
    .then((res) => res.buffer())
    .then((buffer) => parser.parseBody(buffer, callback))
    .catch(callback)
}
