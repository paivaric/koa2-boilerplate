import Router from 'koa-router'
import User from './model'

const router = new Router({
  prefix: '/users'
})

router.param('id', async (id, ctx, next) => {
  let user = await User.findOne().where('_id').equals(id).exec();
  if (!user || !user.id) {
    ctx.status = 404;
    ctx.body = 'User not found'
    ctx.app.emit('error', new Error(ctx.body), ctx)
    return;
  }
  ctx.user = user
  await next();
})

let checkSameUser = async (ctx, next) => {
  let sameUser = (ctx.user && ctx.user.id === (ctx.session.user && ctx.session.user.id))
  if (!sameUser) {
    ctx.status = 403
    ctx.body = 'User not authorized'
    ctx.app.emit('error', new Error(ctx.body), ctx)
    return;
  }
  await next();
}

router
  .get('/', async ctx => ctx.body = await User.find({}))
  .post('/', async ctx => ctx.body = await new User(ctx.request.body).save())
  .get('/:id', async ctx => ctx.body = ctx.user)
  .put('/:id', checkSameUser, async ctx => ctx.body = await ctx.user.update(ctx.request.body))
  .delete('/:id', checkSameUser, async ctx => ctx.body = await ctx.user.remove())



export default router