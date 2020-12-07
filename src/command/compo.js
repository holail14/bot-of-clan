const database = require('../model/storage');




function getCompos(message, hdv) {
    database.getCompo(hdv).then((compositions) => {
        if (compositions.length == 0) {
            message.channel.send(`Aucune compo n'est disponible pour l'hdv${hdv}`)
        } else {
            let msg = `Compos disponibles pour l'hdv${hdv} :`;
            compositions.forEach(compo => {
                msg += `
              - difficulté : **${compo.difficulty}**/3, compo : ${compo.compo}`;
            });
            message.channel.send(msg)
        }
    });
}


function help(channel) {
    channel.send(`\`coc!compo [hdv]\`
    [hdv] : 'hdv' suivi du numero
    Affiche les compos pour un niveau d'hdv 

\`coc!compo [hdv] [difficulté] [troupes]\`
    [hdv] : 'hdv' suivi du numero
    [difficulté] : 1, 2 ou 3 suivant la difficulté
    [troupes] : troupes de la compo
    Ajoute une compo pour un niveau d'hdv
    example : coc!compo hdv2 :barbare: x10 :archere: x10`);
}

module.exports = function compo(message) {
    const tokens = message.content.split(' ');
    if (tokens[1] === 'aide') {
        help(message.channel);
    } else {
        let hdv = tokens[1];
        if (typeof hdv === 'undefined')
            help(message.channel);
        else {
            hdv = hdv.substr(3);
            if (hdv == '') {
                help(message.channel);
            } else {
                const difficulty = tokens[2];
                let compo = tokens[3];
                if (difficulty && compo) {
                    compo = message.content.split('hdv' + hdv + ' ' + difficulty)[1].trim();
                    if (difficulty != "1" && difficulty != "2" && difficulty != "3") {
                        help(message.channel);
                    } else {
                        database.addCompo(hdv, difficulty, compo);
                        message.channel.send(`La compo pour l'hdv${hdv} a été ajoutée.`);
                    }
                } else {
                    getCompos(message, hdv);
                }
            }
        }
    }
};