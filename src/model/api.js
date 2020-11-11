const axios = require('axios').default;

const KEY = process.env.COC;

const config = {
  headers: {
    Authorization: `Bearer ${KEY}`
  }
};

function fetch(uri) {
  return axios.get(`https://api.clashofclans.com/v1/${uri}`, config);
}

function members (tag) {
  return fetch(`clans/%23${tag}/members`);
}

function warlog (tag) {
  return fetch(`clans/%23${tag}/warlog`);
}

function clan (tag) {
  return fetch(`clans/%23${tag}`);
}

function currentwar (tag) {
  return fetch(`clans/%23${tag}/currentwar`);
}

function player (tag) {
  return fetch(`players/%23${tag}`);
}

module.exports = {
  clan,
  members,
  warlog,
  currentwar,
  player
}