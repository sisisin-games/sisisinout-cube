const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();
const router = require('./router');

app.use(serve('public'));
// app.use(router.routes());

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
