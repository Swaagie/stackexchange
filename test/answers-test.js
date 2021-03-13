/*tags expect*/

const { expect } = require('chai');
const nock = require('nock');
const nockScope = nock('https://api.stackexchange.com', { allowUnmocked: true });

var stackexchange = require('../lib/stackexchange');
const zlib = require('zlib');

const answerFixture = {
  "owner": {
    "reputation": 9001,
    "user_id": 1,
    "user_type": "registered",
    "accept_rate": 55,
    "profile_image": "https://www.gravatar.com/avatar/a007be5a61f6aa8f3e85ae2fc18dd66e?d=identicon&r=PG",
    "display_name": "Example User",
    "link": "http://example.stackexchange.com/users/1/example-user"
  },
  "down_vote_count": 2,
  "up_vote_count": 3,
  "is_accepted": false,
  "score": 1,
  "last_activity_date": 1615257075,
  "last_edit_date": 1615282275,
  "creation_date": 1615213875,
  "answer_id": 5678,
  "question_id": 1234,
  "link": "http://example.stackexchange.com/questions/1234/an-example-post-title/5678#5678",
  "title": "An example post title",
  "body": "An example post body"
};


describe('Answers', function () {
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
    expect(() => { context.answers.answers(filter); }).to.throw();
    expect(() => { context.answers.comments(filter); }).to.throw();
  });

  it('gets all answers', function(done) {
    nockScope.get('/2.2/answers/?pagesize=10&sort=activity&order=asc&site=stackoverflow')
      .reply(200, {})

    context.answers.answers(filter, function(err, results) {
      if (err) throw err;
      done();
    });
  });

  it('gets specified answers', function(done) {
    context.answers.answers(filter, function(err, results) {
      if (err) throw err;

      expect(results.items).to.have.length(1);
      expect(results.has_more).to.be.false;
      done();
    }, [66539406]);
  });

  it('get comments', function(done) {
    filter.sort = undefined;
    const answerIds = [11227902, 11227877, 11237235, 12853037, 14889969]
    const callback = (err, results) => {
      if (err) throw err;

      expect(results.items).to.have.length(10);
      expect(results.has_more).to.be.true;
      expect(results.items.every((val) => val.hasOwnProperty('comment_id'))).to.be.true;

      done();
    }
    context.answers.comments(filter, callback, answerIds);
  });

  it('use a different site via filter', function(done) {
    nockScope.get('/2.2/answers/?pagesize=10&sort=activity&order=asc&site=softwareengineering')
      .reply(200, {})
    filter.site = 'softwareengineering';
    context.answers.answers(filter, function(err, results){
      if (err) throw err;
      done();
    });
  });

  it('upvote/downvote should throw an error without key or access_token', function() {
    function check(fn) {
      const cases = [{}, {key: 'fhqwhgads'}, {access_token: 'fhqwhgads'}];
      cases.forEach((filter) => {
        context.answers[fn](filter, '51812', (err) => {
          expect(err.message).to.equal(`answers.${fn} lacks key and/or access token as criteria`);
        });
      });
    }

    check('upvote');
    check('downvote');
  });


  {
    const filter = {key: 'fhqwhgads', access_token: 'fhqwhgads'};
    {
      it('upvote should post to expected endpoints', function(done) {
        nockScope.post('/2.2/answers/42/upvote', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(answerFixture))));

        context.answers.upvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined;
          expect(question).to.deep.equal(answerFixture);
          done();
        });
      });

      it('downvote should post to expected endpoints', function(done) {
        nockScope.post('/2.2/answers/42/downvote', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(answerFixture))));

        context.answers.downvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined;
          expect(question).to.deep.equal(answerFixture);
          done();
        });
      });

      it('upvote with undo should post to expected endpoints', function(done) {
        nockScope.post('/2.2/answers/42/upvote/undo', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(answerFixture))));

        context.answers.upvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined;
          expect(question).to.deep.equal(answerFixture);
          done();
        }, true);
      });

      it('downvote with undo should post to expected endpoints', function(done) {
        nockScope.post('/2.2/answers/42/downvote/undo', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(answerFixture))));

        context.answers.downvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined;
          expect(question).to.deep.equal(answerFixture);
          done();
        }, true);
      });
    }
  }
});
