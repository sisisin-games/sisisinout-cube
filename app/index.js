const Koa = require('koa');
const serve = require('koa-static');
const createIo = require('socket.io');

const app = new Koa();
const io = createIo(app);

app.use(serve('public'));

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
