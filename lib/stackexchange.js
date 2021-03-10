'use strict'

const config = require('./config')
const search = require('./methods/search')
const questions = require('./methods/questions')
const answers = require('./methods/answers')
const users = require('./methods/users')
const tags = require('./methods/tags')

/**
 * Initialize StackExchange API.
 *
 * @Constructor
 * @param {Object} options
 * @api public
 */
module.exports = function StackExchange (options) {
  // Mitigate options to config.
  this.config = config
  Object.keys(options || {}).forEach(function setConfig (key) {
    config.set(key, options[key])
  })

  // Expose methods.
  this.search = search
  this.questions = questions
  this.answers = answers
  this.users = users
  this.tags = tags
}
