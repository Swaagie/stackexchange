'use strict';

/**
 * Required modules.
 */
var util = require('utile');

/**
 * Default configuration.
 */
var config = {
  'version': 2.1,
  'site': 'stackoverflow'
};

/**
 * Initialize StackExchange API.
 *
 * @Constructor
 * @param {Object} options
 * @api public
 */
function StackExchange (options) {
  this.config = util.mixin(config, options);
}

// Expose the constructor
module.exports = StackExchange;
