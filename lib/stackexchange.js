'use strict';

var util = require('utile')
    , config = require('./config')
    , search = require('./methods/search')
    , questions = require('./methods/questions')
    , users = require('./methods/users');

/**
 * Initialize StackExchange API.
 *
 * @Constructor
 * @param {Object} options
 * @api public
 */
module.exports = function StackExchange(options) {
    // Mitigate options to config.
    this.config = config;
    Object.keys(options || {}).forEach(function setConfig(key) {
        config.set(key, options[key]);
    });

    // Expose methods.
    this.search = search;
    this.questions = questions;
    this.users = users;
};
