const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URI}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
client.connect();

async function linkClan(id, tag) {
  const database = client.db('bot-of-clans');
  const clans = database.collection('clans');
  const filter = { id: id };
  const options = { upsert: true };
  const updateTag = {
    $set: {
      tag: tag
    }
  }
  return await clans.updateOne(filter, updateTag, options);
}

async function linkPlayer(id, tag) {
  const database = client.db('bot-of-clans');
  const clans = database.collection('players');
  const filter = { id: id };
  const options = { upsert: true };
  const updateTag = {
    $set: {
      tag: tag
    }
  }
  return await clans.updateOne(filter, updateTag, options);
}

module.exports = {
  linkPlayer,
  linkClan
}