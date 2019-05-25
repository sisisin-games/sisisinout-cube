const Router = require('koa-router');

const router = new Router();

router.get('/', async ctx => {
  ctx.type = 'html';
  ctx.body = '<h1>Hello, world!</h1>';
});

module.exports = router;
