const dedent = require('dedent');
const sio = require('socket.io');
const { Score, getScoreList } = require('../entity/score');
const { postToSlack } = require('./slack');

module.exports = server => {
  const io = sio(server);

  const listeners = {
    async 'score:list'(next) {
      next(await getScoreList());
    },
    async 'score:put'(data, next) {
      const score = new Score(data.name, data.time);
      await score.save();
      next();
      postToSlack({
        icon_emoji: ':new:',
        username: 'sisisinout-cube',
        text: dedent`
          ${data.name} さんが ${getTimeText(data.time)} でクリアしました
        `,
      });
      io.emit('score:list', await getScoreList());
    },
  };

  io.on('connection', socket => {
    Object.entries(listeners).forEach(([name, fn]) => {
      socket.on(name, fn);
    });
  });
};

function getTimeText(time) {
  if (!time) {
    return '';
  }
  function pad(n, val) {
    return String(val).padStart(n, '0');
  }
  const ms = time % 1000;
  const seconds = (time / 1000) % 60 | 0;
  const minutes = (time / 1000 / 60) % 60 | 0;
  const hours = (time / 1000 / 60 / 60) | 0;
  let res = '';
  if (hours) {
    res += `${pad(2, hours)}時間`;
  }
  if (res || minutes) {
    res += `${pad(2, minutes)}分`;
  }
  if (res || seconds) {
    res += `${pad(2, seconds)}秒`;
  }
  res += pad(3, ms);
  return res;
}
