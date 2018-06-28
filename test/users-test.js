var stackexchange = require('../lib/stackexchange');

describe('Users', function () {
  'use strict';

  var context, filter;

  beforeEach(function() {
    context = new stackexchange();
    filter = {
      pagesize: 10
    };
  });

  function expectUserProperty(item) {
    expect(item).to.have.property('badge_counts');
    expect(item).to.have.property('account_id');
    expect(item).to.have.property('is_employee');
    expect(item).to.have.property('last_modified_date');
    expect(item).to.have.property('last_access_date');
    expect(item).to.have.property('reputation_change_year');
    expect(item).to.have.property('reputation_change_quarter');
    expect(item).to.have.property('reputation_change_month');
    expect(item).to.have.property('reputation_change_week');
    expect(item).to.have.property('reputation_change_day');
    expect(item).to.have.property('reputation');
    expect(item).to.have.property('creation_date');
    expect(item).to.have.property('user_type');
    expect(item).to.have.property('user_id');
    expect(item).to.have.property('accept_rate');
    expect(item).to.have.property('location');
    expect(item).to.have.property('website_url');
    expect(item).to.have.property('link');
    expect(item).to.have.property('profile_image');
    expect(item).to.have.property('display_name');
  }

  it('get users', function(done) {
    context.users.users(filter, function(err, results) {
      if (err) throw err;

      expect(results.items).to.have.length(10);
      expectUserProperty(results.items[0]);
      expect(results.has_more).to.be.true;
      done();
    });
  });

});
