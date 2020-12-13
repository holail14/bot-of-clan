const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}?retryWrites=true&w=majority`;

async function linkClan(id, tag) {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
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
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const players = database.collection('players');
    const filter = { id: id, tag: tag };
    const options = { upsert: true };
    const updateTag = {
      $set: {
        tag: tag
      }
    };
    await players.updateOne(filter, updateTag, options);
  } finally {
    client.close();
  }
}

async function unlinkPlayer(id, tag) {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const players = database.collection('players');
    const filter = { id: id, tag: tag };
    await players.deleteOne(filter);
  } finally {
    client.close();
  }
}

async function addBuilding(id,  building, startTime, endTime) {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const buildings = database.collection('buildings');
    const filter = { id: id, building: building, startTime: startTime };
    const options = { upsert: true };
    const updateTag = {
      $set: {
        building: building,
        startTime: startTime,
        endTime: endTime
      }
    };
    await buildings.updateOne(filter, updateTag, options);
  } finally {
    client.close();
  }
}
async function getBuildings(id) {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const buildings = database.collection('buildings');
    let filter = {};
    if(id != ''){
      filter = { id: id };
    }
    const options = {
      sort: { endTime: 1 },
    };

    const cursor = buildings.find(filter, options);
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      return [];
    }
    let buildingsArray = [];
    await cursor.forEach(item => buildingsArray.push(item));
    return buildingsArray;
  } finally {
    await client.close();
  }
}
async function deleteBuilding(id, building, startTime, endTime) {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const buildings = database.collection('buildings');
    const filter = { id: id, building: building, startTime: startTime, endTime: endTime };
    await buildings.deleteOne(filter);
  } finally {
    client.close();
  }
}

async function addCompo(hdv, difficulty, compo) {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const compositions = database.collection('compos');
    const filter = { hdv: hdv, difficulty: difficulty, compo: compo };
    const options = { upsert: true };
    const updateTag = {
      $set: {
        hdv: hdv,
        difficulty: difficulty,
        compo: compo
      }
    };
    await compositions.updateOne(filter, updateTag, options);
  } finally {
    client.close();
  }
}
async function getCompo(hdv) {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const compositions = database.collection('compos');
    let filter = {};
    if(hdv != ''){
      filter = { hdv: hdv };
    }
    const options = {
      sort: { difficulty: 1 },
    };

    const cursor = compositions.find(filter, options);
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      return [];
    }
    let compositionsArray = [];
    await cursor.forEach(item => compositionsArray.push(item));
    return compositionsArray;
  } finally {
    await client.close();
  }
}

async function getPlayers() {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const players = database.collection('players');
    let filter = {};

    const cursor = players.find(filter);
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      return [];
    }
    let playersArray = [];
    await cursor.forEach(item => playersArray.push(item));
    return playersArray;
  } finally {
    await client.close();
  }
}
async function getPlayer(id) {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const players = database.collection('players');
    const filter = { id: id };

    const cursor = players.find(filter);
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      return [];
    }
    let playersArray = [];
    await cursor.forEach(item => playersArray.push(item));
    return playersArray;
  } finally {
    client.close();
  }
}
async function getPlayerByTag(tag) {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const players = database.collection('players');
    const filter = { tag: tag };

    const cursor = players.find(filter);
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      return [];
    }
    let playersArray = [];
    await cursor.forEach(item => playersArray.push(item));
    return playersArray;
  } finally {
    client.close();
  }
}

async function getClan(id) {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const players = database.collection('clans');
    const filter = { id: id };
    return await players.findOne(filter);
  } finally {
    client.close();
  }
}

async function getAllClans() {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const clans = database.collection('clans');
    let filter = {};

    const cursor = clans.find(filter);
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      return [];
    }
    let clansArray = [];
    await cursor.forEach(item => clansArray.push(item));
    return clansArray;
  } finally {
    client.close();
  }
}


async function getWall(level) {
  const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  try {
    await client.connect();
    const database = client.db('bot-of-clans');
    const walls = database.collection('walls');
    const filter = { level: parseFloat(level) };
    return await walls.findOne(filter);
  } finally {
    client.close();
  }
}

module.exports = {
  linkPlayer,
  unlinkPlayer,
  linkClan,
  addBuilding,
  getBuildings,
  deleteBuilding,
  addCompo,
  getCompo,
  getPlayers,
  getPlayer,
  getPlayerByTag,
  getClan,
  getAllClans,
  getWall
};
