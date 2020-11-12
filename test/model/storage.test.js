const storage = require('../../src/model/storage');

require('dotenv').config();

const clan = '2YYPULPUP'; // Uniclan. fr
const member = 'VGGUPY99' // Clement Vtrd

describe('REQUEST BDD', function () {
  describe('Get Player', function () {
    it("Should return discord player data", done => {
        storage.getPlayer(member)
        .then(done())
        .catch(done(error));
    });
  });
  describe('Get Player By Tag', function () {
    it("Should return discord player data by Coc tag", done => {
      storage.getPlayerByTag(member)
        .then(done())
        .catch(done(error));
    });
  });
  describe('Get Clan', function () {
    it("Should return discord server data", done => {
      storage.getClan(clan)
        .then(done())
        .catch(done(error));
    });
  });
});