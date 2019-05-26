const { BaseEntity } = require('typeorm');

class Score extends BaseEntity {
  constructor(name, time) {
    super();
    this.name = name;
    this.time = time;
    this.createdAt = null;
    this.updatedAt = null;
  }
}

async function getScoreList() {
  return Score.find({ order: { time: 'ASC', updatedAt: 'ASC' } });
}

module.exports = {
  Score,
  getScoreList,
};
