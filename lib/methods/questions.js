'use strict';

/**
 * Required modules.
 */
var query = require('../query')
  , Logger = require('devnull')
  , log = new Logger({ timestamp: false });


/**
 * Gets all the questions on the site or returns the questions identified in [ids].
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} ids collection of IDs
 * @api public
 */
function questions (criteria, callback, ids) {
  ids = ids || [];
  query('questions/' + ids.join(';'), criteria, callback);
}

/**
 * Gets the answers to a set of questions identified in [ids].
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} ids collection of IDs
 * @api public
 */
function answers (criteria, callback, ids) {
  if (!ids || !ids.length) return log.error('questions.answers lacks IDs to query');
  query('questions/' + ids.join(';') + '/answers', criteria, callback);
}

// Expose commands.
module.exports.questions = questions;
module.exports.answers = answers;
