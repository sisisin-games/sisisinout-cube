const { EntitySchema } = require('typeorm');
const { Score } = require('./score');

module.exports = new EntitySchema({
  name: 'Score',
  target: Score,
  columns: {
    name: {
      primary: true,
      type: 'varchar',
    },
    time: {
      type: 'int',
    },
    createdAt: {
      createDate: true,
    },
    updatedAt: {
      updateDate: true,
    },
  },
});
