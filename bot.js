const Discord = require('discord.js');
const Giphy = require('giphy-js-sdk-core');
const config = require('./config.json');

const giphy = Giphy(config.giphyAPIKey);
const client = new Discord.Client();

function playHonk() {
  let expedition = client.channels.get(config.discord.expeditionID);

  expedition
    .join()
    .then(connection => {
      const dispatcher = connection.playFile(
        `./honks/honk_${Math.ceil(Math.random() * 10)}.mp3`
      );
      dispatcher.on('end', end => {
        expedition.leave();
      });
    })
    .catch(console.error);
}

function sendGif() {
  giphy.random('gifs', { tag: 'goose' }).then(res => {
    client.channels.get(config.discord.generalID).send(res.data.url);
  });
}

function switchNicknames() {
  let name1 = client.guilds.get(config.discord.serverID).members.random();
  let name2 = client.guilds.get(config.discord.serverID).members.random();

  while (name1 === name2)
    name2 = client.guilds.get(config.discord.serverID).members.random();

  let temp = name1.nickname || 'Goose';
  name1.setNickname(name2.nickname || 'Goose');
  name2.setNickname(temp);
}

client.on('ready', () => {
  let start = 10;
  let range = 5;

  setInterval(() => {
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        playHonk();
        break;
      case 1:
        sendGif();
        break;
      case 2:
        switchNicknames();
        break;
    }
  }, Math.floor(Math.random() * (range * 60000) + start * 60000));
});

client.on('message', msg => {
  switch (msg.content.toLowerCase()) {
    case 'honk':
      playHonk();
      break;
    case 'goose':
      sendGif();
      break;
    case 'switcharoo':
      switchNicknames();
      break;
  }
});

client.login(config.discord.apiKey);
