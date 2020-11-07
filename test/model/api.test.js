const api = require('../../src/model/api');

require('dotenv').config();

const clan = '2YYPULPUP'; // Uniclan. fr
const member = 'VGGUPY99' // Clement Vtrd

describe('API', function () {
  describe('Clan', function () {
    it("Should return clan's data", done => {
      api.clan(clan)
        .then(done())
        .catch(done(error));
    });
  });
  describe('Members', function () {
    it("Should return the list of members", done => {
      api.members(clan)
        .then(done())
        .catch(done(error));
    });
  });
  describe('Player', function () {
    it("Should return information about some player", done => {
      api.player(member)
        .then(done())
        .catch(done(error));
    });
  });
  describe('Warlog', function () {
    it("Should return war logs", done => {
      api.warlog(clan)
        .then(done())
        .catch(done(error));
    });
  });
  describe('Current war', function () {
    it("Should return status of the current war", done => {
      api.currentwar(clan)
        .then(done())
        .catch(done(error));
    });
  });
});