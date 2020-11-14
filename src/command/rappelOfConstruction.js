const database = require('../model/storage');

function convertToMS(duration) {
    let ms = 0;
    if (duration.includes('d')) {
        day = duration.split('d');
        day = day[0];
        ms += day * 86400000;
    }
    if (duration.includes('h')) {
        hour = duration.substr(duration.indexOf('h') - 2, 2);
        ms += hour * 3600000;
    }
    if (duration.includes('m')) {
        minute = duration.substr(duration.indexOf('m') - 2, 2);
        ms += minute * 60000;
    }
    if (duration.includes('s')) {
        seconde = duration.substr(duration.indexOf('s') - 2, 2);
        ms += seconde * 1000;
    }

    return ms;
}

function help(channel) {
    channel.send(`\`coc!rappel [bâtiment] [durée]\`
bâtiment : nom de votre batiment (en un seul mot) :house:
durée : durée de construction (en attaché) :clock1:
 - j pour les jours
 - h pour les heures (avec un 0 devant les chiffres)
 - m pour les minutes (avec un 0 devant les chiffres)
 - s pour les secondes (avec un 0 devant les chiffres)
exemple : 2d12h30m45s :wink:`);
}

module.exports = function rappel(message) {
    const tokens = message.content.split(' ');
    if (tokens[1] === 'aide') {
        help(message.channel);
    } else {
        const building = tokens[1];
        const duration = tokens[2];
        if (typeof building === 'undefined' || typeof duration === 'undefined')
            help(message.channel);
        else {
            message.channel.send(`Ton ouvrier va terminé l'amélioration de ${building} dans ${duration}`)
            setTimeout(() => {
                message.channel.send(`Hey ${message.author.toString()}, ton ouvrier a terminé l'amélioration de ${building}`);
            }, convertToMS(duration));
        }
    }
}