import Router from 'koa-router'
import User from './model'

const router = new Router({
  prefix: '/users'
})

router
  .get('/', async ctx => ctx.body = await User.find({}))
  .post('/', async (ctx, next) => ctx.body = await new User(ctx.request.body).save())
  .get('/:id', async (ctx, next) =>
    ctx.body = await User.findById(ctx.params.id))
  .put('/:id', async (ctx, next) =>
    ctx.body = await User.findByIdAndUpdate(ctx.params.id, ctx.body))
  .delete('/:id', async (ctx, next) =>
    ctx.body = await User.findByIdAndRemove(ctx.params.id))

export default router