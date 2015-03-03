var webdriverio = require('webdriverio');
var expect = require('chai').expect;
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/playlister';
var monk = require('monk');
var db = monk(mongoUri);
var table = db.get('pgSongChoice');

describe('Party goer selecting songs page', function() {

  var client = {};

  before(function(done) {
    client = webdriverio.remote({ desiredCapabilities: {browserName: 'chrome'}   });
    client.init(done);
  });

  beforeEach(function() {
    client.url('http://localhost:3000/partygoer/getsongs/partyName/partyDate');
  });
 
  after(function(done) {
    client.end(done);
  });

  context('When user visits the page', function() {

    it('Should have a title', function(done) {
      client
        .getText('#pg-title', function(err, text) {
          expect(err).to.not.be.true;
          expect(text).to.eql('Please enter your song choices for partyName on partyDate')
        })
        .call(done);
    });

    it('Should have a subtitle', function(done) {
      client
        .getText('#pg-subtitle', function(err, text) {
          expect(err).to.not.be.true;
          expect(text).to.eql("Type a track name and click on 'Search'. Then, click on any track from the results to get a 30 second preview.")
        })
        .call(done);
    });

    it('Should have an email form', function(done) {
      client
        .getTagName('#party-email-form', function(err, tagName) {
          expect(err).to.not.be.true;
          expect(tagName).to.eql('form')
        })
        .call(done);
    });

    it('Should have form to choose the song', function(done) {
      client
        .getTagName('#song-choices', function(err, tagName) {
          expect(err).to.not.be.true;
          expect(tagName).to.eql('form')
        })
        .call(done);
    });
  });

  context('When user selects a song', function() {

    it('Should see a list of songs', function(done) {
      client
        .setValue('#query', 'superstition')
        .click('#search')
        .waitFor('.cover', 5000)
        .getText('#results', function(err, text) {
          expect(text).to.include('Stevie Wonder: Superstition - Single Version')
        })
        .call(done);
    });

    it('Should be able to select a song', function(done) {
      client
        .setValue('#query', 'give it all')
        .click('#search')
        .waitFor('.cover', 5000)
        .click('#4d4AIYFkR8MSWtKBmphyir1')
        .setValue('#email', 'rock@email.com')
        .click('#go')
        .waitFor('#thank-you', 5000)
        .getText('#thank-you', function(err, text) {
          expect(text).to.include('hello rock@email.com, your song id is spotify:track:4d4AIYFkR8MSWtKBmphyir')
        })
        .call(done);
    });

    it('Should get an error if the email field is empty', function(done) {
      client
        .setValue('#query', 'superstition')
        .click('#search')
        .waitFor('.cover', 5000)
        .click('#300RfAPZ57B0y6YYj9n6DN1')
        .click('#go')
        .waitFor('.error-message', 5000)
        .getText('.error-message', function(err, text) {
          expect(text).to.eql('You must add an email.')
        })
        .call(done);
    });

    it('Should get an error if that song has already been selected', function(done) {
      client
        .setValue('#query', 'superstition')
        .click('#search')
        .waitFor('.cover', 5000)
        .click('#300RfAPZ57B0y6YYj9n6DN1')
        .setValue('#email', 'partygoer@email.com')
        .click('#go')
        .refresh()
        .waitForExist('#search', 5000)
        .setValue('#query', 'superstition')
        .click('#search')
        .waitFor('.cover', 5000)
        .click('#300RfAPZ57B0y6YYj9n6DN1')
        .setValue('#email', 'anothergoer@email.com')
        .click('#go')
        .waitFor('.error-message', 5000)
        .getText('.error-message', function(err, text) {
          expect(text).to.eql('Sorry that song has already been selected for this party, please choose again.')
        })
        .call(done);
    });
  });
        table.drop();

});