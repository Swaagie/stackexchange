'use strict';

/**
 * Required modules.
 */
var query = require('../query');

/**
 * Gets all the users on the site or returns the users identified in [ids].
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} ids collection of IDs
 * @api public
 */
function users(criteria, ids, callback) {
  if (typeof ids === 'function') {
    callback = ids;
    ids = [];
  }
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
function answers(criteria, ids, callback) {
  if (!ids || !ids.length) return callback(new Error('users.answers lacks IDs to query'));
  query('users/' + ids.join(';') + '/answers', criteria, callback);
}

// Expose commands.
module.exports.users = users;
module.exports.answers = answers;
