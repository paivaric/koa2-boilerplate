import Router from 'koa-router'
import User from './model'

const router = new Router({
  prefix: '/users'
})

router.param('id', async (id, ctx, next) => {
  let user = await User.findOne().where('_id').equals(id).exec();
  if (!user) {
    ctx.status = 404;
    ctx.app.emit('error', new Error('User not found'), ctx)
  }
  ctx.user = user
  await next();
})
router
  .get('/', async ctx => ctx.body = await User.find({}))
  .post('/', async (ctx, next) => ctx.body = await new User(ctx.request.body).save())
  .get('/:id', async (ctx, next) => {
    let sameUser = (ctx.user && ctx.user.id === (ctx.session.user && ctx.session.user.id))
    if (!sameUser) ctx.status = 404
    await next();
  }, async (ctx, next) => {
    ctx.body = ctx.user
    return next()
  })
  .put('/:id', async (ctx, next) =>
    ctx.body = await User.findByIdAndUpdate(ctx.params.id, ctx.body))
  .delete('/:id', async (ctx, next) =>
    ctx.body = await User.findByIdAndRemove(ctx.params.id))

export default router