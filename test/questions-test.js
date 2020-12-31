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

  it('throws if no callback', function() {
    expect(() => { context.questions.questions(filter); }).to.throw();
    expect(() => { context.questions.answers(filter); }).to.throw();
  })

  it('get questions and answers', function(done) {
    context.questions.questions(filter, function(err, results) {
      if (err) throw err;

      expect(results.items).to.have.length(10);
      expect(results.has_more).to.be.true;
      expect(results.items.every((val) => val.link.startsWith('https://stackoverflow.com/questions/'))).to.be.true;

      const questionIds = results.items.map((item) => item.question_id);
      const callback = (err, results) => {
        if (err) throw err;

        expect(results.items).to.have.length(10);
        expect(results.has_more).to.be.true;
        expect(results.items.every((val) => val.hasOwnProperty('answer_id'))).to.be.true;

        done();
      }
      context.questions.answers(filter, callback, questionIds);
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
  });

  it('upvote/downvote should throw an error without key or access_token', function() {
    function check(fn) {
      const cases = [{}, {key: 'fhqwhgads'}, {access_token: 'fhqwhgads'}];
      cases.forEach((filter) => {
        context.questions[fn](filter, '51812', (err) => {
          expect(err.message).to.equal(`questions.${fn} lacks key and/or access token as criteria`);
        });
      });
    }

    check('upvote');
    check('downvote');
  });
});
