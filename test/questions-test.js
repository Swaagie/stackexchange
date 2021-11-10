/* tags expect */

const { expect } = require('chai')
const nock = require('nock')
const nockScope = nock('https://api.stackexchange.com', { allowUnmocked: true })

const stackexchange = require('../lib/stackexchange')
const zlib = require('zlib')

const questionFixture = {
  tags: [
    'windows',
    'c#',
    '.net'
  ],
  owner: {
    reputation: 9001,
    user_id: 1,
    user_type: 'registered',
    accept_rate: 55,
    profile_image: 'https://www.gravatar.com/avatar/a007be5a61f6aa8f3e85ae2fc18dd66e?d=identicon&r=PG',
    display_name: 'Example User',
    link: 'https://example.stackexchange.com/users/1/example-user'
  },
  is_answered: false,
  view_count: 31415,
  favorite_count: 1,
  down_vote_count: 2,
  up_vote_count: 3,
  answer_count: 0,
  score: 1,
  last_activity_date: 1615207909,
  creation_date: 1615164709,
  last_edit_date: 1615233109,
  question_id: 1234,
  link: 'https://example.stackexchange.com/questions/1234/an-example-post-title',
  title: 'An example post title',
  body: 'An example post body'
}

describe('Questions', function () {
  'use strict'

  let options, context, filter

  beforeEach(function () {
    options = { version: 2.2 }
    context = new stackexchange(options)
    filter = {
      pagesize: 10,
      sort: 'activity',
      order: 'asc'
    }
  })

  it('throws if no callback', function () {
    expect(() => { context.questions.questions(filter) }).to.throw()
    expect(() => { context.questions.answers(filter) }).to.throw()
    expect(() => { context.questions.comments(filter) }).to.throw()
  })

  it('get questions and answers', function (done) {
    nockScope.get('/2.2/questions/?pagesize=10&sort=activity&order=asc&site=stackoverflow')
      .reply(200, { items: [{ tags: ['database', 'architecture'], owner: { reputation: 114592, user_id: 1196, user_type: 'registered', accept_rate: 37, profile_image: 'https://i.stack.imgur.com/iQcva.jpg?s=128&g=1', display_name: 'aku', link: 'https://stackoverflow.com/users/1196/aku' }, is_answered: true, view_count: 1153, closed_date: 1543160438, answer_count: 4, score: 7, last_activity_date: 1220367388, creation_date: 1220364992, last_edit_date: 1495535570, question_id: 39628, link: 'https://stackoverflow.com/questions/39628/keeping-validation-logic-in-sync-between-server-and-client-sides', closed_reason: 'Opinion-based', title: 'Keeping validation logic in sync between server and client sides' }, { tags: ['windows-vista', 'virtual-pc'], owner: { reputation: 24662, user_id: 2429, user_type: 'registered', accept_rate: 82, profile_image: 'https://www.gravatar.com/avatar/9d268448378b2d9864c976047d93d5a9?s=128&d=identicon&r=PG', display_name: 'Seb Nilsson', link: 'https://stackoverflow.com/users/2429/seb-nilsson' }, is_answered: true, view_count: 1533, accepted_answer_id: 40819, answer_count: 1, score: 4, last_activity_date: 1220394139, creation_date: 1220357523, last_edit_date: 1220362348, question_id: 39357, content_license: 'CC BY-SA 2.5', link: 'https://stackoverflow.com/questions/39357/windows-vista-virtual-pc-image-for-visual-studio-development-minimized', title: 'Windows Vista Virtual PC-image for Visual Studio-development minimized' }, { tags: ['sql-server', 'port', 'msde'], owner: { reputation: 6235, user_id: 3475, user_type: 'registered', accept_rate: 91, profile_image: 'https://www.gravatar.com/avatar/592a0a2bca674feca1bb6ca1d05665e4?s=128&d=identicon&r=PG', display_name: 'Scott Lawrence', link: 'https://stackoverflow.com/users/3475/scott-lawrence' }, is_answered: true, view_count: 12124, accepted_answer_id: 42196, answer_count: 4, score: 13, last_activity_date: 1220463905, creation_date: 1220462754, question_id: 42146, content_license: 'CC BY-SA 2.5', link: 'https://stackoverflow.com/questions/42146/what-are-the-best-ways-to-determine-what-port-an-application-is-using', title: 'What are the best ways to determine what port an application is using?' }, { tags: ['mobile', 'hardware', 'pocketpc'], owner: { reputation: 10215, user_id: 2213, user_type: 'registered', accept_rate: 92, profile_image: 'https://www.gravatar.com/avatar/78897c96c45c02fa88b191c854fa83a8?s=128&d=identicon&r=PG', display_name: 'Ian Patrick Hughes', link: 'https://stackoverflow.com/users/2213/ian-patrick-hughes' }, is_answered: true, view_count: 157, accepted_answer_id: 42339, answer_count: 1, score: 3, last_activity_date: 1220470238, creation_date: 1220468401, question_id: 42312, content_license: 'CC BY-SA 2.5', link: 'https://stackoverflow.com/questions/42312/are-there-adapters-for-cf-type-ii-to-microsd', title: 'Are There Adapters for CF Type II to MicroSD?' }, { tags: ['.net', 'windows', 'networking', 'remoting'], owner: { reputation: 12886, user_id: 3776, user_type: 'registered', accept_rate: 100, profile_image: 'https://www.gravatar.com/avatar/c8675f33db6abf21dfda734e66d53f09?s=128&d=identicon&r=PG', display_name: 'McKenzieG1', link: 'https://stackoverflow.com/users/3776/mckenzieg1' }, is_answered: true, view_count: 687, accepted_answer_id: 42474, answer_count: 2, score: 7, last_activity_date: 1220489665, creation_date: 1220472748, question_id: 42468, content_license: 'CC BY-SA 2.5', link: 'https://stackoverflow.com/questions/42468/how-do-i-measure-bytes-in-out-of-an-ip-port-used-for-net-remoting', title: 'How do I measure bytes in/out of an IP port used for .NET remoting?' }, { tags: ['c#', 'polymorphism'], owner: { reputation: 910, user_id: 3602, user_type: 'registered', profile_image: 'https://www.gravatar.com/avatar/a57e127cbcfdd4cce20e44d14ea033f5?s=128&d=identicon&r=PG', display_name: 'TrolleFar', link: 'https://stackoverflow.com/users/3602/trollefar' }, is_answered: true, view_count: 7022, accepted_answer_id: 43516, answer_count: 6, score: 18, last_activity_date: 1220529061, creation_date: 1220527654, question_id: 43511, content_license: 'CC BY-SA 2.5', link: 'https://stackoverflow.com/questions/43511/can-i-prevent-an-inherited-virtual-method-from-being-overridden-in-subclasses', title: 'Can I prevent an inherited virtual method from being overridden in subclasses?' }, { tags: ['.net', 'configuration'], owner: { reputation: 32690, user_id: 2361, user_type: 'registered', accept_rate: 85, profile_image: 'https://i.stack.imgur.com/GPBvD.jpg?s=128&g=1', display_name: 'Jakub Šturc', link: 'https://stackoverflow.com/users/2361/jakub-%c5%a0turc' }, is_answered: true, view_count: 2179, accepted_answer_id: 43633, answer_count: 1, score: 4, last_activity_date: 1220531610, creation_date: 1220530453, last_edit_date: 1220530974, question_id: 43591, content_license: 'CC BY-SA 2.5', link: 'https://stackoverflow.com/questions/43591/override-webclientprotocol-timeout-via-web-config', title: 'Override WebClientProtocol.Timeout via web.config' }, { tags: ['web-services', 'web', 'web-applications'], owner: { user_type: 'does_not_exist', display_name: 'Elijah Manor' }, is_answered: true, view_count: 184, accepted_answer_id: 43407, answer_count: 2, score: 4, last_activity_date: 1220531919, creation_date: 1220466183, question_id: 42262, content_license: 'CC BY-SA 2.5', link: 'https://stackoverflow.com/questions/42262/twitching-consumption-of-web-services-from-web-site-to-web-application', title: 'Twitching Consumption of Web Services from Web Site to Web Application' }, { tags: ['asp.net-mvc'], owner: { reputation: 2091, user_id: 4204, user_type: 'registered', accept_rate: 88, profile_image: 'https://www.gravatar.com/avatar/61273477b46f3d7e57c6cbb51d38301e?s=128&d=identicon&r=PG', display_name: 'Mihai Lazar', link: 'https://stackoverflow.com/users/4204/mihai-lazar' }, is_answered: true, view_count: 1679, accepted_answer_id: 43363, answer_count: 2, score: 9, last_activity_date: 1220532625, creation_date: 1220508765, last_edit_date: 1220528186, question_id: 43243, content_license: 'CC BY-SA 2.5', link: 'https://stackoverflow.com/questions/43243/how-does-web-routing-work', title: 'How does Web Routing Work?' }, { tags: ['.net', 'wpf', 'performance'], owner: { reputation: 11621, user_id: 93, user_type: 'registered', accept_rate: 95, profile_image: 'https://www.gravatar.com/avatar/ce74962e5a92bca7a49c6595668d4cd4?s=128&d=identicon&r=PG', display_name: 'MojoFilter', link: 'https://stackoverflow.com/users/93/mojofilter' }, is_answered: true, view_count: 487, accepted_answer_id: 43771, answer_count: 1, score: 5, last_activity_date: 1220535302, creation_date: 1220535156, last_edit_date: 1220535302, question_id: 43768, content_license: 'CC BY-SA 2.5', link: 'https://stackoverflow.com/questions/43768/wpf-control-performance', title: 'WPF control performance' }], has_more: true, quota_max: 300, quota_remaining: 296 })
    context.questions.questions(filter, function (err, results) {
      if (err) throw err

      expect(results.items).to.have.length(10)
      expect(results.has_more).to.be.true
      expect(results.items.every((val) => val.link.startsWith('https://stackoverflow.com/questions/'))).to.be.true

      const questionIds = results.items.map((item) => item.question_id)
      const callback = (err, results) => {
        if (err) throw err

        expect(results.items).to.have.length(10)
        expect(results.has_more).to.be.true
        expect(results.items.every((val) => val.hasOwnProperty('answer_id'))).to.be.true

        done()
      }
      nockScope.get('/2.2/questions/39628;39357;42146;42312;42468;43511;43591;42262;43243;43768/answers?pagesize=10&sort=activity&order=asc&site=stackoverflow')
        .reply(200, { items: [{ owner: { reputation: 35320, user_id: 1219, user_type: 'registered', accept_rate: 60, profile_image: 'https://www.gravatar.com/avatar/62cc585b9fd3ee7182dadbd09a7f4b47?s=128&d=identicon&r=PG', display_name: 'Eric Z Beard', link: 'https://stackoverflow.com/users/1219/eric-z-beard' }, is_accepted: false, score: 4, last_activity_date: 1220365473, creation_date: 1220365473, answer_id: 39654, question_id: 39628, content_license: 'CC BY-SA 2.5' }, { owner: { reputation: 31, user_id: 2870, user_type: 'registered', display_name: 'user2870', link: 'https://stackoverflow.com/users/2870/user2870' }, is_accepted: false, score: 2, last_activity_date: 1220366326, creation_date: 1220366326, answer_id: 39683, question_id: 39628, content_license: 'CC BY-SA 2.5' }, { owner: { reputation: 13087, user_id: 4213, user_type: 'registered', accept_rate: 80, profile_image: 'https://i.stack.imgur.com/oWF0Y.jpg?s=128&g=1', display_name: 'Marcio Aguiar', link: 'https://stackoverflow.com/users/4213/marcio-aguiar' }, is_accepted: false, score: 2, last_activity_date: 1220366935, creation_date: 1220366935, answer_id: 39706, question_id: 39628, content_license: 'CC BY-SA 2.5' }, { owner: { reputation: 358817, user_id: 3043, user_type: 'registered', accept_rate: 70, profile_image: 'https://www.gravatar.com/avatar/61d2a0f034915fa9d2acd6f6b145bba8?s=128&d=identicon&r=PG', display_name: 'Joel Coehoorn', link: 'https://stackoverflow.com/users/3043/joel-coehoorn' }, is_accepted: false, score: 1, last_activity_date: 1220367083, creation_date: 1220367083, answer_id: 39708, question_id: 39628, content_license: 'CC BY-SA 2.5' }, { owner: { reputation: 1065, user_id: 291, user_type: 'registered', profile_image: 'https://www.gravatar.com/avatar/b0b1ce3a4e0a77abd157ec0309b72922?s=128&d=identicon&r=PG', display_name: 'The How-To Geek', link: 'https://stackoverflow.com/users/291/the-how-to-geek' }, is_accepted: true, score: 3, last_activity_date: 1220394139, creation_date: 1220394139, answer_id: 40819, question_id: 39357, content_license: 'CC BY-SA 2.5' }, { owner: { reputation: 310953, user_id: 3153, user_type: 'registered', accept_rate: 98, profile_image: 'https://www.gravatar.com/avatar/47d8644c0ad8d89635fca422dd6d3ab5?s=128&d=identicon&r=PG', display_name: 'Brian R. Bondy', link: 'https://stackoverflow.com/users/3153/brian-r-bondy' }, is_accepted: false, score: 2, last_activity_date: 1220462830, creation_date: 1220462830, answer_id: 42147, question_id: 42146, content_license: 'CC BY-SA 2.5' }, { owner: { reputation: 366646, user_id: 1288, user_type: 'registered', accept_rate: 93, profile_image: 'https://www.gravatar.com/avatar/fc763c6ff6c160ddad05741e87e517b6?s=128&d=identicon&r=PG', display_name: 'Bill the Lizard', link: 'https://stackoverflow.com/users/1288/bill-the-lizard' }, is_accepted: false, score: 12, last_activity_date: 1220462956, creation_date: 1220462956, answer_id: 42152, question_id: 42146, content_license: 'CC BY-SA 2.5' }, { owner: { reputation: 2132, user_id: 3657, user_type: 'registered', accept_rate: 100, profile_image: 'https://www.gravatar.com/avatar/33c9f96632ecdb70c138e1cd637dbdbc?s=128&d=identicon&r=PG', display_name: 'Jeremy', link: 'https://stackoverflow.com/users/3657/jeremy' }, is_accepted: false, score: 6, last_activity_date: 1220463530, creation_date: 1220463530, answer_id: 42174, question_id: 42146, content_license: 'CC BY-SA 2.5' }, { owner: { reputation: 4109, user_id: 2885, user_type: 'registered', accept_rate: 75, profile_image: 'https://www.gravatar.com/avatar/79e329fbc6449ee6227a12a56a27d646?s=128&d=identicon&r=PG', display_name: 'Rydell', link: 'https://stackoverflow.com/users/2885/rydell' }, is_accepted: true, score: 8, last_activity_date: 1220463905, creation_date: 1220463905, answer_id: 42196, question_id: 42146, content_license: 'CC BY-SA 2.5' }, { owner: { reputation: 28973, user_id: 194, user_type: 'registered', accept_rate: 63, profile_image: 'https://www.gravatar.com/avatar/b336fc4bc06c327650d1dff9938e7a00?s=128&d=identicon&r=PG', display_name: 'Adam Haile', link: 'https://stackoverflow.com/users/194/adam-haile' }, is_accepted: true, score: 1, last_activity_date: 1220469580, creation_date: 1220469580, answer_id: 42339, question_id: 42312, content_license: 'CC BY-SA 2.5' }], has_more: true, quota_max: 300, quota_remaining: 295 })

      context.questions.answers(filter, callback, questionIds)
    })
  })

  it('get comments', function (done) {
    filter.sort = undefined
    const questionIds = [11227809, 927358, 2003505, 292357, 231767]
    const callback = (err, results) => {
      if (err) throw err

      expect(results.items).to.have.length(10)
      expect(results.has_more).to.be.true
      expect(results.items.every((val) => val.hasOwnProperty('comment_id'))).to.be.true

      done()
    }
    context.questions.comments(filter, callback, questionIds)
  })

  it('use a different site via filter', function (done) {
    nockScope.get('/2.2/questions/?pagesize=10&sort=activity&order=asc&site=softwareengineering')
      .reply(200, {})
    filter.site = 'softwareengineering'
    context.questions.questions(filter, function (err, results) {
      if (err) throw err
      done()
    })
  })

  it('upvote/downvote should throw an error without key or access_token', function () {
    function check (fn) {
      const cases = [{}, { key: 'fhqwhgads' }, { access_token: 'fhqwhgads' }]
      cases.forEach((filter) => {
        context.questions[fn](filter, '51812', (err) => {
          expect(err.message).to.equal(`questions.${fn} lacks key and/or access token as criteria`)
        })
      })
    }

    check('upvote')
    check('downvote')
  })

  it('upvote/downvote should throw an error if no callback supplied', function () {
    const filter = { key: 'fhqwhgads', access_token: 'fhqwhgads' }

    expect(() => { context.questions.upvote(filter, '51812') }).to.throw()
    expect(() => { context.questions.downvote(filter, '51812') }).to.throw()
  })

  {
    const filter = { key: 'fhqwhgads', access_token: 'fhqwhgads' }
    {
      it('upvote should post to expected endpoints', function (done) {
        nockScope.post('/2.2/questions/42/upvote', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(questionFixture))))

        context.questions.upvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined
          expect(question).to.deep.equal(questionFixture)
          done()
        })
      })

      it('downvote should post to expected endpoints', function (done) {
        nockScope.post('/2.2/questions/42/downvote', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(questionFixture))))

        context.questions.downvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined
          expect(question).to.deep.equal(questionFixture)
          done()
        })
      })

      it('upvote with undo should post to expected endpoints', function (done) {
        nockScope.post('/2.2/questions/42/upvote/undo', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(questionFixture))))

        context.questions.upvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined
          expect(question).to.deep.equal(questionFixture)
          done()
        }, true)
      })

      it('downvote with undo should post to expected endpoints', function (done) {
        nockScope.post('/2.2/questions/42/downvote/undo', filter)
          .reply(200, zlib.deflateSync(Buffer.from(JSON.stringify(questionFixture))))

        context.questions.downvote(filter, '42', (err, question) => {
          expect(err).to.be.undefined
          expect(question).to.deep.equal(questionFixture)
          done()
        }, true)
      })

      it('uses error argument in callback for invalid zip', function (done) {
        nockScope.post('/2.2/questions/101010/upvote', filter)
          .reply(200, 'fhqwhgads')

        context.questions.upvote(filter, '101010', (err, question) => {
          expect(question).to.be.undefined
          expect(err.message).to.equal('incorrect header check')
          done()
        })
      })

      it('uses error argument in callback for invalid JSON', function (done) {
        nockScope.post('/2.2/questions/101010/downvote', filter)
          .reply(200, zlib.deflateSync(Buffer.from('fhqwhgads')))

        context.questions.downvote(filter, '101010', (err, question) => {
          expect(question).to.be.undefined
          expect(err.message).to.equal('Unexpected token h in JSON at position 1')
          done()
        })
      })

      it('reports error from request', function (done) {
        nockScope.post('/2.2/questions/1/upvote', filter)
          .replyWithError({ message: 'come on', code: 'ETIMEDOUT' })

        context.questions.upvote(filter, '1', (err, question) => {
          expect(question).to.be.undefined
          expect(err.message).to.include('come on')
          expect(err.code).to.be.equal('ETIMEDOUT')
          done()
        })
      })
    }
  }
})
