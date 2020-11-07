module.exports = {
  apps : [{
    script: 'src/bot.js',
    watch: '.'
  }],

  deploy : {
    production : {
      user : 'root',
      host : '138.68.111.64',
      ref  : 'origin/master',
      repo : 'https://github.com/clementvtrd/',
      path : '/root/bot-of-clans',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
