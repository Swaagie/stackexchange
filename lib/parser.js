const zlib = require('zlib')

/**
 * Parse the buffer. StackExchange promises to always deliver zipped content.
 *
 * @param {Buffer} buffer response content
 * @param {Function} callback return results
 * @api private
 */
function parseBody (buffer, callback) {
  zlib.unzip(buffer, function Unzipped (error, body) {
    if (error) {
      return callback(error)
    }
    let jsonBody
    try {
      jsonBody = JSON.parse(body.toString())
    } catch (error) {
      return callback(error)
    }
    callback(undefined, jsonBody)
  })
}

// Export functions
module.exports.parseBody = parseBody
