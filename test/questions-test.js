/*tags expect*/

const { expect } = require('chai');
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

  it('throws if no callback', function(done) {
    expect(() => { context.questions.questions(filter); }).to.throw();
    done();
  })

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

  it('upvote a question should throw an error without key or access_token', function(done) {
    let count = 0;
    const cases = [{}, {key: 'fhqwhgads'}, {access_token: 'fhqwhgads'}];
    cases.forEach((filter) => {
      context.questions.upvote(filter, '51812', (err) => {
        expect(err.message).to.equal('questions.upvote lacks key and/or access token as criteria');
        count++;
        if (count >= cases.length) {
          done();
        }
      });
    });
  })
});
