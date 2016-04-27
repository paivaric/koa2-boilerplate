import Router from 'koa-router'
import User from './model'

const router = new Router({
  prefix: '/users'
})

router.param('id', async (id, ctx, next) => {
  let user = await User.findOne().where('_id').equals(id).exec()
  if (!user) {
    ctx.throw = (404, 'User not found')
  } else {
    ctx.user = user
    await next()
  }
})

let checkSameUser = async (ctx, next) => {
  if (!ctx.session.userId) ctx.throw(401)
  if (ctx.user && ctx.user.id === ctx.session.userId) await next()
  else ctx.throw(403)
}

let createMongoQuery = async (ctx, next) => {
  ctx.mongoQuery = ctx.modifier(User.find(ctx.query).lean())
  await next();
}

router
  .get('/', createMongoQuery, async ctx => ctx.body = await ctx.mongoQuery.exec())
  .post('/', async ctx => ctx.body = await new User(ctx.request.body).save())
  .get('/:id', async ctx => ctx.body = ctx.user)
  .put('/:id', checkSameUser, async ctx => ctx.body = await ctx.user.update(ctx.request.body))
  .delete('/:id', checkSameUser, async ctx => ctx.body = await ctx.user.remove())



export default router