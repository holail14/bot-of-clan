const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useUnifiedTopology: true });

async function linkClan(id, tag) {
  try {
    await client.connect()
    const database = client.db('bot-of-clans');
    const clans = database.collection('clans');
    const filter = { id: id };
    const options = { upsert: true };
    const updateTag = {
      $set: {
        tag: tag
      }
    };
    await clans.updateOne(filter, updateTag, options);
  } finally {
    client.close();
  }
  
}

async function linkPlayer(id, tag) {
  try {
    await client.connect()
    const database = client.db('bot-of-clans');
    const clans = database.collection('players');
    const filter = { id: id };
    const options = { upsert: true };
    const updateTag = {
      $set: {
        tag: tag
      }
    }
    await clans.updateOne(filter, updateTag, options);
  } finally {
    client.close();
  }
}

async function getPlayer(id) {
  try {
    await client.connect()
    const database = client.db('bot-of-clans');
    const players = database.collection('players');
    const filter = { id: id };
    return await players.findOne(filter);
  } finally {
    client.close();
  }
}

module.exports = {
  linkPlayer,
  linkClan,
  getPlayer,
}
