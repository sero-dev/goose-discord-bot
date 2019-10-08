const Discord = require('discord.js');
const config = require('./config.json');
const { playHonk, sendGif, switchNicknames } = require('./goose');

const client = new Discord.Client();
const { channels, guilds } = client;

client.on('ready', () => {
  let start = 10;
  let range = 5;

  setInterval(() => {
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        playHonk(channels.get(config.discord.expeditionID));
        break;
      case 1:
        sendGif(channels.get(config.discord.generalID));
        break;
      case 2:
        switchNicknames(guilds.get(config.discord.serverID).members);
        break;
    }
  }, Math.floor(Math.random() * (range * 60000) + start * 60000));
});

client.on('message', msg => {
  switch (msg.content.toLowerCase()) {
    case 'honk':
      playHonk(channels.get(config.discord.expeditionID));
      break;
    case 'goose':
      sendGif(channels.get(config.discord.generalID));
      break;
    case 'switcharoo':
      switchNicknames(guilds.get(config.discord.serverID).members);
      break;
  }
});

client.login(config.discord.apiKey);
