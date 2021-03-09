/*tags expect*/

const { expect } = require('chai');
const nock = require('nock');
var stackexchange = require('../lib/stackexchange');
const zlib = require('zlib');

const questionFixture = {
  "tags": [
    "windows",
    "c#",
    ".net"
  ],
  "owner": {
    "reputation": 9001,
    "user_id": 1,
    "user_type": "registered",
    "accept_rate": 55,
    "profile_image": "https://www.gravatar.com/avatar/a007be5a61f6aa8f3e85ae2fc18dd66e?d=identicon&r=PG",
    "display_name": "Example User",
    "link": "https://example.stackexchange.com/users/1/example-user"
  },
  "is_answered": false,
  "view_count": 31415,
  "favorite_count": 1,
  "down_vote_count": 2,
  "up_vote_count": 3,
  "answer_count": 0,
  "score": 1,
  "last_activity_date": 1615207909,
  "creation_date": 1615164709,
  "last_edit_date": 1615233109,
  "question_id": 1234,
  "link": "https://example.stackexchange.com/questions/1234/an-example-post-title",
  "title": "An example post title",
  "body": "An example post body"
};

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


  {
    const nockScope = nock('https://api.stackexchange.com', { allowUnmocked: true });
    const filter = {key: 'fhqwhgads', access_token: 'fhqwhgads'};
    {
      it('upvote should post to expected endpoints', function(done) {
        nockScope.post('/2.2/questions/42/upvote', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(questionFixture))));
        
        context.questions.upvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined;
          expect(question).to.deep.equal(questionFixture);
          done();
        });
      });

      it('downvote should post to expected endpoints', function(done) {
        nockScope.post('/2.2/questions/42/downvote', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(questionFixture))));
        
        context.questions.downvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined;
          expect(question).to.deep.equal(questionFixture);
          done();
        });
      });

      it('upvote with undo should post to expected endpoints', function(done) {
        nockScope.post('/2.2/questions/42/upvote/undo', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(questionFixture))));
        
        context.questions.upvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined;
          expect(question).to.deep.equal(questionFixture);
          done();
        }, true);
      });

      it('downvote with undo should post to expected endpoints', function(done) {
        nockScope.post('/2.2/questions/42/downvote/undo', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(questionFixture))));
        
        context.questions.downvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined;
          expect(question).to.deep.equal(questionFixture);
          done();
        }, true);
      });

      it('uses error argument in callback for invalid zip', function(done) {
        nockScope.post('/2.2/questions/101010/upvote', filter)
          .reply(200, 'fhqwhgads');

        context.questions.upvote(filter, '101010', (err, question) => {
          expect(question).to.be.undefined;
          expect(err.message).to.equal('incorrect header check');
          done();
        });
      });

      it('uses error argument in callback for invalid JSON', function(done) {
        nockScope.post('/2.2/questions/101010/downvote', filter)
          .reply(200, zlib.deflateSync(Buffer.from('fhqwhgads')));

        context.questions.downvote(filter, '101010', (err, question) => {
          expect(question).to.be.undefined;
          expect(err.message).to.equal('Unexpected token h in JSON at position 1');
          done();
        });
      })
    }
  }
});
