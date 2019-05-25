const Koa = require('koa');
const serve = require('koa-static');
const socket = require('socket.io');

const app = new Koa();

app.use(serve('public'));

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
