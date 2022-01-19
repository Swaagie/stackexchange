const { expect } = require('chai')
const stackexchange = require('../lib/stackexchange')
const nock = require('nock')

const nockScope = nock('https://api.stackexchange.com', { allowUnmocked: true })

describe('Search', function () {
  'use strict'

  let context, filter

  beforeEach(function () {
    context = new stackexchange()
    filter = {
      pagesize: 10,
      order: 'desc',
      sort: 'activity'
    }
  })

  function expectQuestionProperty (item) {
    const props = ['tags', 'owner', 'is_answered', 'view_count', 'answer_count',
      'score', 'last_activity_date', 'creation_date',
      'question_id', 'link', 'title']
    props.forEach((prop) => expect(item).to.have.property(prop))
  }

  it('does simple search', function (done) {
    filter.intitle = 'nodejs'
    context.search.search(filter, function (err, results) {
      if (err) throw err

      expect(results.items).to.have.length(10)
      results.items.forEach((item) => { expectQuestionProperty(item) })
      expect(results.has_more).to.be.true

      done()
    })
  })

  it('does advanced search', function (done) {
    filter.q = 'nodejs'
    context.search.advanced(filter, function (err, results) {
      if (err) throw err

      expect(results.items).to.have.length(10)
      results.items.forEach((item) => { expectQuestionProperty(item) })
      expect(results.has_more).to.be.true

      done()
    })
  })

  it('reports invalid JSON via error object of callback', function (done) {
    nockScope.get('/2.2/search?pagesize=10&order=desc&sort=activity&q=fhqwhgads&site=stackoverflow')
      .reply(200, 'fhqwhgads')

    filter.q = 'fhqwhgads'
    context.search.search(filter, function (err, results) {
      expect(results).to.be.undefined
      console.log(err.message);
      expect(err.message).to.include('Unexpected token h in JSON at position 1')
      done()
    })
  })

  it('reports error from request', function (done) {
    nockScope.get('/2.2/search?pagesize=10&order=desc&sort=activity&q=42&site=stackoverflow')
      .replyWithError({ message: 'come on', code: 'ETIMEDOUT' })

    filter.q = '42'
    context.search.search(filter, function (err, results) {
      expect(results).to.be.undefined
      expect(err.message).to.include('come on')
      expect(err.code).to.be.equal('ETIMEDOUT')
      done()
    })
  })
})
