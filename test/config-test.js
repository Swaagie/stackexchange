/* global expect */
const config = require('../lib/config')

describe('Config', function () {
  'use strict'

  it('has API key', function () {
    expect(config.get('api')).to.equal('api.stackexchange.com')
  })

  it('has API endpoint', function () {
    expect(config.get('site')).to.equal('stackoverflow')
  })

  it('has API version', function () {
    const version = config.get('version')

    expect(version).to.equal(2.2)
    expect(version).to.be.a('Number')
  })

  it('has default protocol', function () {
    expect(config.get('protocol')).to.equal('https:')
  })
})
