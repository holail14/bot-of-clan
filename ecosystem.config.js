module.exports = {
  apps: [{
    name: "bot of clans",
    script: 'src/bot.js'
  }],

  deploy : {
    production : {
      user : 'root',
      host : '138.68.111.64',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      ref: 'origin/master',
      repo: 'git@github.com:clementvtrd/bot-of-clans',
      path: '/var/www/bot-of-clans'
    }
  }
};
