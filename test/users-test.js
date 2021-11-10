const { expect } = require('chai')
const stackexchange = require('../lib/stackexchange')

describe('Users', function () {
  'use strict'

  let context, filter

  beforeEach(function () {
    context = new stackexchange()
    filter = {
      pagesize: 10
    }
  })

  function expectUserProperty (item) {
    const props = ['badge_counts', 'account_id', 'is_employee',
      'last_modified_date', 'last_access_date',
      'reputation_change_year', 'reputation_change_quarter',
      'reputation_change_month', 'reputation_change_week',
      'reputation_change_day', 'reputation', 'creation_date',
      'user_type', 'user_id', 'location', 'website_url', 'link',
      'profile_image', 'display_name']
    props.forEach((prop) => expect(item).to.have.property(prop))
  }

  function expectedAnswerProperty (item) {
    const props = ['owner', 'is_accepted', 'score', 'last_activity_date',
      'creation_date', 'answer_id', 'question_id',
      'content_license']
    props.forEach((prop) => expect(item).to.have.property(prop))
  }

  it('get users and get answers for user', function (done) {
    context.users.users(filter, function (err, results) {
      if (err) throw err

      expect(results.items).to.have.length(10)
      results.items.forEach((item) => { expectUserProperty(item) })
      expect(results.has_more).to.be.true

      const userIds = results.items.map((items) => items.user_id)

      context.users.answers(filter, userIds, function (err, results) {
        if (err) throw err

        expect(results.items).to.have.length(10)
        results.items.forEach((item) => { expectedAnswerProperty(item) })
        expect(results.has_more).to.be.true

        done()
      })
    })
  })

  it('throws if answers does not get an array of ids', function (done) {
    function checkError (err) {
      expect(err).to.be.instanceof(Error)
      expect(err.message).to.equal('users.answers lacks IDs to query')
    }

    context.users.answers(filter, 0, checkError)
    context.users.answers(filter, [], (err) => { checkError(err); done() })
  })
})
