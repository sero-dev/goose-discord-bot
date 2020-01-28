const Giphy = require('giphy-js-sdk-core');
const giphy = Giphy(process.env.GIPHY);

function playHonk(channel) {
  channel
    .join()
    .then(connection => {
      const dispatcher = connection.playFile(
        `./honks/honk_${Math.ceil(Math.random() * 10)}.mp3`
      );
      dispatcher.on('end', end => {
        channel.leave();
      });
    })
    .catch(console.error);
}

function sendGif(channel) {
  giphy.random('gifs', { tag: 'goose' }).then(res => {
    channel.send(res.data.url);
  });
}

// DEPRECATED
// function switchNicknames(members) {
//   let memberA = members.random();
//   let memberB = members.random();

//   while (memberA === memberB) memberB = members.random();

//   let temp = memberA.nickname || 'Goose';
//   memberA.setNickname(memberB.nickname || 'Goose');
//   memberB.setNickname(temp);
// }

module.exports = { playHonk, sendGif };
