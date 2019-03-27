/*tags expect*/

var stackexchange = require('../lib/stackexchange');

describe('Questions', function () {
  'use strict';

  var options, context, filter;

  beforeEach(function() {
    options = { version: 2.2 };
    context = new stackexchange(options);
    filter = {
      pagesize: 10,
      sort: 'activity',
      order: 'asc'
    };
  });

  it('get questions', function(done) {
    context.questions.questions(filter, function(err, results){
      if (err) throw err;
      expect(results.items).to.have.length(10);
      expect(results.has_more).to.be.true;
      expect(results.items.every((val) => val.link.startsWith('https://stackoverflow.com/questions/'))).to.be.true;
      done();
    });
  });

  it('use a different site via filter', function(done) {
    filter.site = 'softwareengineering';
    context.questions.questions(filter, function(err, results){
      if (err) throw err;
      expect(results.items).to.have.length(10);
      expect(results.has_more).to.be.true;
      expect(results.items.every((val) => val.link.startsWith('https://softwareengineering.stackexchange.com/questions/'))).to.be.true;
      done();
    });    
  })
});
