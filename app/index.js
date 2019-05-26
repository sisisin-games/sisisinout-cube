const Koa = require('koa');
const serve = require('koa-static');
const { createConnection } = require('typeorm');
const io = require('./io');

async function main() {
  await createConnection(require('../ormconfig'));

  const app = new Koa();

  app.use(serve('public'));

  const server = app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });

  io(server);
}

main();
