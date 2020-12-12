
function french(en) {
  // -------- Clan rank --------
  if(en == 'leader'){
    return 'chef';
  }
  if(en == 'coLeader'){
    return 'chef adjoint';
  }
  if(en == 'admin'){
    return 'ainé';
  }
  if(en == 'member'){
    return 'membre';
  }

  // -------- Heroes --------
  if(en == 'Barbarian King'){
    return 'Roi des Barbares';
  }
  if(en == 'Archer Queen'){
    return 'Reine des archers';
  }
  if(en == 'Grand Warden'){
    return 'Grand Gardien';
  }
  if(en == 'Royal Champion'){
    return 'Championne Royale';
  }
  if(en == 'Battle Machine'){
    return 'Machine de combat';
  }

  // -------- Troops --------
  if(en == 'Barbarian'){
    return 'Barbare';
  }
  if(en == 'Archer'){
    return 'Archer';
  }
  if(en == 'Goblin'){
    return 'Gobelin';
  }
  if(en == 'Giant'){
    return 'Géant';
  }
  if(en == 'Wall Breaker'){
    return 'Sapeur';
  }
  if(en == 'Balloon'){
    return 'Ballon';
  }
  if(en == 'Wizard'){
    return 'Sorcier';
  }
  if(en == 'Healer'){
    return 'Guérisseuse';
  }
  if(en == 'Minion'){
    return 'Gargouille';
  }
  if(en == 'Hog Rider'){
    return 'Chevaucheur de cochon';
  }
  if(en == 'Witch'){
    return 'Sorcière';
  }
  if(en == 'Lava Hound'){
    return 'Molosse de lave';
  }
  if(en == 'Bowler'){
    return 'Bouliste';
  }
  if(en == 'Baby Dragon'){
    return 'Bébé dragon';
  }
  if(en == 'Miner'){
    return 'Mineur';
  }
  if(en == 'Wall Wrecker'){
    return 'Bélier';
  }
  if(en == 'Battle Blimp'){
    return 'Dirigeable';
  }
  if(en == 'Yeti'){
    return 'Yéti';
  }
  if(en == 'Ice Golem'){
    return 'Golem de glace';
  }
  if(en == 'Stone Slammer'){
    return 'Broyeur de pierre';
  }
  if(en == 'Siege Barracks'){
    return 'Caserne de siège';
  }
  if(en == 'Headhunter'){
    return 'Chasseuse de têtes';
  }
  // -------- Builder Base Troops --------
  if(en == 'Raged Barbarian'){
    return 'Barbare enragé';
  }
  if(en == 'Sneaky Archer'){
    return 'Archère furtive';
  }
  if(en == 'Beta Minion'){
    return 'Bêta-gargouille';
  }
  if(en == 'Boxer Giant'){
    return 'Géant boxeur';
  }
  if(en == 'Bomber'){
    return 'Bombardier';
  }
  if(en == 'Cannon Cart'){
    return 'Charette à cannon';
  }
  if(en == 'Drop Ship'){
    return 'Ballon livreur';
  }
  if(en == 'Night Witch'){
    return 'Sorcière de la nuit';
  }
  if(en == 'Hog Glider'){
    return 'Chevaucheur du ciel';
  }

  // -------- Spells --------
  if(en == 'Lightning Spell'){
    return 'Sort de Foudre';
  }
  if(en == 'Healing Spell'){
    return 'Sort de Soin';
  }
  if(en == 'Rage Spell'){
    return 'Sort de Rage';
  }
  if(en == 'Jump Spell'){
    return 'Sort de Saut';
  }
  if(en == 'Freeze Spell'){
    return 'Sort de Gel';
  }
  if(en == 'Clone Spell'){
    return 'Sort de Clonage';
  }
  if(en == 'Poison Spell'){
    return 'Sort d\'Empoisonnement';
  }
  if(en == 'Earthquake Spell'){
    return 'Sort Sismique';
  }
  if(en == 'Haste Spell'){
    return 'Sort de Précipitation';
  }
  if(en == 'Skeleton Spell'){
    return 'Sort Squelettique';
  }
  if(en == 'Bat Spell'){
    return 'Sort de Chauve-souris';
  }

  //Other
  if(en == 'API is currently in maintenance, please come back later'){
    return 'L\'API est en cours de maintenance, merci de réessayer plus tard :sob:';
  }

  return en;
}

module.exports = {
  french
};