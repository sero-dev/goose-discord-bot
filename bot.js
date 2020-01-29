const Discord = require('discord.js');
const Long = require('long');
const { playHonk, sendGif } = require('./goose');

const client = new Discord.Client();
const { channels, guilds } = client;

client.on('ready', () => {
  let start = 10; // Minutes before another action can start
  let range = 5; // Range in minutes that an action can start after start time

  // Randomized Actions other period of time
  setInterval(() => {
    switch (Math.floor(Math.random() * 2)) {
      case 0:
        let found = false;
        channels.tap(channel => {
          if (channel.type === 'voice' && found === false) {
            playHonk(channel);
            found = true;
          }
        });
        break;
      case 1:
        sendGif(getDefaultChannel(guilds.first()));
        break;
    }
  }, Math.floor(Math.random() * (range * 60000) + start * 60000));
});

client.on('message', msg => {
  switch (msg.content.toLowerCase()) {
    case 'honk':
      if (msg.member.voiceChannel) playHonk(msg.member.voiceChannel);
      break;
    case 'goose':
      sendGif(msg.channel);
      break;
  }
});

client.on('guildMemberAdd', member => {
  const channel = getDefaultChannel(member.guild);
  channel.send(`Honk! ${member}`);
});

client.login(process.env.BOT_TOKEN);

// Source:
// https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/frequently-asked-questions.md
const getDefaultChannel = guild => {
  if (guild.channels.has(guild.id)) return guild.channels.get(guild.id);

  const generalChannel = guild.channels.find(
    channel => channel.name === 'general'
  );
  if (generalChannel) return generalChannel;

  return guild.channels
    .filter(
      c =>
        c.type === 'text' &&
        c.permissionsFor(guild.client.user).has('SEND_MESSAGES')
    )
    .sort(
      (a, b) =>
        a.position - b.position ||
        Long.fromString(a.id)
          .sub(Long.fromString(b.id))
          .toNumber()
    )
    .first();
};
