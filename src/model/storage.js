const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://root:root@127.0.0.1?retryWrites=true&w=majority';

const client = new MongoClient(uri);

async function linkClan(id, tag) {
  await client.connect();
  try {
    const database = client.db('bot-of-clans');
    const clans = database.collection('clans');
    const filter = { id: id };
    const options = { upsert: true };
    const updateTag = {
      $set: {
        tag: tag
      }
    }
    const result = await clans.updateOne(filter, updateTag, options);
  } finally {
    client.close();
  }
}

async function linkPlayer(id, tag) {
  await client.connect();
  try {
    const database = client.db('bot-of-clans');
    const clans = database.collection('players');
    const filter = { id: id };
    const options = { upsert: true };
    const updateTag = {
      $set: {
        tag: tag
      }
    }
    const result = await clans.updateOne(filter, updateTag, options);
  } finally {
    client.close();
  }
}

module.exports = {
  linkPlayer,
  linkClan
}