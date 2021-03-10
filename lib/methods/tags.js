'use strict'

/**
 * Required modules.
 */
const query = require('../query')

function tagsValidator (tags) {
  return function () {
    if (!tags || !tags.length) {
      return 'tags is required'
    }
    return false
  }
}

const sortPattern1 = /^popular$|^activity$|^name$/
function sortValidator1 (sort) {
  return function () {
    if (!sort) {
      return 'sort is required'
    }
    if (!sort.match(sortPattern1)) {
      return 'sort is invalid. [popular|activity|name]'
    }
    return false
  }
}

const sortPattern2 = /^creation$|^applied$|^activity$/
function sortValidator2 (sort) {
  return function () {
    if (!sort) {
      return 'sort is required'
    }
    if (!sort.match(sortPattern2)) {
      return 'sort is invalid. [creation|applied|activity]'
    }
    return false
  }
}

const periodPattern = /^all_time$|^month$/
function periodValidator (period) {
  return function () {
    if (!period.match(periodPattern)) {
      return 'sort is invalid. [all_time|month]'
    }
    return false
  }
}

function run (validators, tags, criteria, callback) {
  const errors = []
  validators.forEach(function (validator) {
    const err = validator()
    if (err) {
      errors.push(err)
    }
  })
  if (errors.length !== 0) {
    process.nextTick(callback, new Error(errors.join(', ')))
    return
  }
  query(tags, criteria, callback)
}

/**
 * Get the tags on the site.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @api public
 */
function tags (criteria, callback) {
  run([sortValidator1(criteria.sort)], 'tags', criteria, callback)
}

/**
 * Get tags on the site by their names.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} tags collection of Tag
 * @api public
 */
function info (criteria, callback, tags) {
  run([tagsValidator(tags), sortValidator1(criteria.sort)], 'tags/' + tags.join(';') + '/info', criteria, callback)
}

/**
 * Get the tags on the site that only moderators can use.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @api public
 */
function moderatorOnly (criteria, callback) {
  run([sortValidator1(criteria.sort)], 'tags/moderator-only', criteria, callback)
}

/**
 * Get the tags on the site that fulfill required tag constraints.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @api public
 */
function required (criteria, callback) {
  run([sortValidator1(criteria.sort)], 'tags/required', criteria, callback)
}

/**
 * Get all the tag synonyms on the site.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @api public
 */
function synonyms (criteria, callback) {
  run([sortValidator2(criteria.sort)], 'tags/synonyms', criteria, callback)
}

/**
 * Get frequently asked questions in a set of tags.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} tags collection of Tag
 * @api public
 */
function faq (criteria, callback, tags) {
  run([tagsValidator(tags)], 'tags/' + tags.join(';') + '/faq', criteria, callback)
}

/**
 * Get related tags, based on common tag pairings.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} tags collection of Tag
 * @api public
 */
function related (criteria, callback, tags) {
  run([tagsValidator(tags)], 'tags/' + tags.join(';') + '/related', criteria, callback)
}

/**
 * Get the synonyms for a specific set of tags.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} tags collection of Tag
 * @api public
 */
function tagsSynonyms (criteria, callback, tags) {
  run([tagsValidator(tags), sortValidator2(criteria.sort)], 'tags/' + tags.join(';') + '/synonyms', criteria, callback)
}

/**
 * Get the top answer posters in a specific tag, either in the last month or for all time.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} tags collection of Tag
 * @param {String} all_time or month
 * @api public
 */
function topAnswerers (criteria, callback, tags, period) {
  period = period || 'all_time'
  run([tagsValidator(tags), periodValidator(period)], 'tags/' + tags.join(';') + '/top-answerers/' + period,
    criteria, callback)
}

/**
 * Get the top question askers in a specific tag, either in the last month or for all time.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} tags collection of Tag
 * @param {String} all_time or month
 * @api public
 */
function topAskers (criteria, callback, tags, period) {
  period = period || 'all_time'
  run([tagsValidator(tags), periodValidator(period)], 'tags/' + tags.join(';') + '/top-askers/' + period,
    criteria, callback)
}

/**
 * Get the wiki entries for a set of tags.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} tags collection of Tag
 * @api public
 */
function wiki (criteria, callback, tags) {
  run([tagsValidator(tags)], 'tags/' + tags.join(';') + '/wikis', criteria, callback)
}

// Expose commands.
module.exports.tags = tags
module.exports.info = info
module.exports.moderatorOnly = moderatorOnly
module.exports.required = required
module.exports.synonyms = synonyms
module.exports.faq = faq
module.exports.related = related
module.exports.tagsSynonyms = tagsSynonyms
module.exports.topAnswerers = topAnswerers
module.exports.topAskers = topAskers
module.exports.wiki = wiki
