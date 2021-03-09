const { expect } = require('chai');
var stackexchange = require('../lib/stackexchange');
const nock = require('nock');

describe('Search', function () {
  'use strict';

  var context, filter;

  beforeEach(function() {
    context = new stackexchange();
    filter = {
      pagesize: 10,
      order: 'desc',
      sort: 'activity'
    };
  });

  function expectQuestionProperty(item) {
    const props = ['tags', 'owner', 'is_answered', 'view_count', 'answer_count',
                   'score', 'last_activity_date', 'creation_date',
                   'question_id', 'link', 'title',];
    props.forEach((prop) => expect(item).to.have.property(prop));
  }

  it('does simple search', function(done) {
    filter.intitle = 'nodejs';
    context.search.search(filter, function(err, results) {
      if (err) throw err;

      expect(results.items).to.have.length(10);
      results.items.forEach((item) => { expectQuestionProperty(item); });
      expect(results.has_more).to.be.true;

      done();
    });
  });

  it('does advanced search', function(done) {
    filter.q = 'nodejs';
    context.search.advanced(filter, function(err, results) {
      if (err) throw err;

      expect(results.items).to.have.length(10);
      results.items.forEach((item) => { expectQuestionProperty(item); });
      expect(results.has_more).to.be.true;

      done();
    });
  });

  it('reports invalid JSON via error object of callback', function(done) {
    const nockScope = nock('https://api.stackexchange.com', { allowUnmocked: true });
    nockScope.get('/2.2/search?pagesize=10&order=desc&sort=activity&q=fhqwhgads&site=stackoverflow')
      .reply(200, 'fhqwhgads');
    filter.q = 'fhqwhgads';
    context.search.search(filter, function(err, results) {
      expect(results).to.be.undefined;
      expect(err.message).to.be.equal('invalid json response body at https://api.stackexchange.com/2.2/search?pagesize=10&order=desc&sort=activity&q=fhqwhgads&site=stackoverflow reason: Unexpected token h in JSON at position 1');
      done();
    })
  });

});
