module.exports = {
  type: 'sqlite',
  database: '.data/db/score.sqlite3',
  entities: ['entity/*.schema.js'],
  synchronize: true,
};
