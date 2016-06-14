'use strict';

/**
 * Required modules.
 */
var query = require('../query')
  , Logger = require('devnull')
  , log = new Logger({ timestamp: false });
/**
 * Gets all the users on the site or returns the users identified in [ids].
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} ids collection of IDs
 * @api public
 */
function users(criteria, callback, ids) {
	ids = ids || [];
	query('users/' + ids.join(';'), criteria, callback);
}

/**
 * Gets the answers to a set of users identified in [ids].
 *
 * @param {Object} criteria
 * @param {Array} ids collection of IDs
 * @param {Function} callback return results
 * @api public
 */
function answers (criteria, ids, callback) {
  if (!ids || !ids.length) return log.error('users.answers lacks IDs to query');
  query('users/' + ids.join(';') + '/answers', criteria, callback);
}

// Expose commands.
module.exports.users = users;
module.exports.answers = answers;
