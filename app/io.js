const sio = require('socket.io');
const { Score, getScoreList } = require('../entity/score');

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
      io.emit('score:list', await getScoreList());
    },
  };

  io.on('connection', socket => {
    Object.entries(listeners).forEach(([name, fn]) => {
      socket.on(name, fn);
    });
  });
};
