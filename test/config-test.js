'use strict';

var vows = require('vows')
  , assert = require('assert')
  , config = require('../lib/config');

vows.describe('Config').addBatch({
    'has key api': {
        topic: function () { return config.get('api'); }
      , 'which equal api.stackexchange.com': function (topic) {
          assert.equal(topic, 'api.stackexchange.com');
        }
    }
  , 'has key site': {
        topic: function () { return config.get('site'); }
      , 'which equals stackoverflow': function (topic) {
          assert.equal(topic, 'stackoverflow');
        }
    }
  , 'has key version': {
        topic: function () { return config.get('version'); }
      , 'which equals 2.1': function (topic) {
          assert.equal(topic, 2.1);
        }
      , 'and is type number': function (topic) {
          assert.equal(typeof topic, 'number');
        }
    }
  , 'has key protocol': {
        topic: function () { return config.get('protocol'); }
      , 'which equals http:': function (topic) {
          assert.equal(topic, 'http:');
        }
    }
  , 'uses storage': {
        topic: function () { return config.stores; }
      , 'memory': function (topic) {
          assert('memory' in topic);
        }
    }
}).export(module);
