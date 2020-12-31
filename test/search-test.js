const { expect } = require('chai');
var stackexchange = require('../lib/stackexchange');

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
});
