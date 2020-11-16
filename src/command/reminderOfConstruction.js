const database = require('../model/storage');

function convertToMS(duration) {
  let ms = 0;
  if (duration.includes('d')) {
    let day = duration.split('d');
    day = day[0];
    ms += day * 86400000;
  }
  if (duration.includes('h')) {
    let hour = duration.substr(duration.indexOf('h') - 2, 2);
    ms += hour * 3600000;
  }
  if (duration.includes('m')) {
    let minute = duration.substr(duration.indexOf('m') - 2, 2);
    ms += minute * 60000;
  }
  if (duration.includes('s')) {
    let seconde = duration.substr(duration.indexOf('s') - 2, 2);
    ms += seconde * 1000;
  }

  return ms;
}

function reverseMs(duration) {
  let string = '';
  if (duration > 86400000) {
    let day = Math.floor(duration / 86400000);
    duration = duration % 86400000;
    string += day + 'd';
  }
  if (duration > 3600000) {
    let hour = Math.floor(duration / 3600000);
    string += hour + 'h';
    duration = duration % 3600000;
  }
  if (duration > 60000) {
    let minute = Math.floor(duration / 60000);
    string += minute + 'm';
    duration = duration % 60000;
  }
  if (duration > 1000) {
    let seconde = Math.floor(duration / 1000);
    string += seconde + 's';
  }

  return string;
}

async function reminderOfBuildings(id, author) {
  database.getBuildings(id).then((buildings) => {
    if (buildings.length == 0) {
      author.createDM().then(channel => {
        channel.send('Aucun de vos bâtiments n\'est en construction.');
      });
    } else {
      let msg = 'Vos bâtiments en construction : ';
      buildings.forEach(building => {
        msg += `
                - ${building.building}, se termine dans ${reverseMs(building.endTime - Date.now())}.`;
      });
            
      author.createDM().then(channel => {
        channel.send(msg);
      });
    }
  });
}

function help(channel) {
  channel.send(`\`coc!rappel\` : Affiche un résumé des constructions enregistrées

\`coc!rappel [bâtiment] [durée]\` : ajoute un nouveau rappel.
- bâtiment : nom de votre batiment (en un seul mot) :house:
- durée : durée de construction (attaché) :clock1:
  - d pour les jours
  - h pour les heures (avec un 0 devant les chiffres)
  - m pour les minutes (avec un 0 devant les chiffres)
  - s pour les secondes (avec un 0 devant les chiffres)
exemple : 02d12h08m45s :wink:`);
}

module.exports = function rappel(message) {
  const tokens = message.content.split(' ');
  if (tokens[1] === 'aide') {
    help(message.channel);
  }
  else if (typeof tokens[1] === 'undefined' && typeof tokens[2] === 'undefined') {
    reminderOfBuildings(message.author.id, message.author);
  }
  else {
    const building = tokens[1];
    const duration = tokens[2];
    if (typeof building === 'undefined' || typeof duration === 'undefined')
      help(message.channel);
    else {
      let ms_duration = convertToMS(duration);
      let startTime = Date.now();
      let endTime = startTime + ms_duration;
      database.addBuilding(message.author.id, building, startTime, endTime);
      message.channel.send(`Ton ouvrier va terminer l'amélioration de ${building} dans ${duration}`);
      setTimeout(() => {
        message.author.createDM().then(channel => {
          channel.send(`Hey ${message.author.toString()}, ton ouvrier a terminé l'amélioration de ${building}`);
        });
        database.deleteBuilding(message.author.id, building, startTime, endTime);
      }, ms_duration);
    }
  }
};