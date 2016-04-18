import Router from 'koa-router'
import Position from './model'

const router = new Router({
  prefix: '/positions'
})

router.param('id', async (id, ctx, next) => {
  let position = await Position.findOne().where('_id').equals(id).exec();
  if (!position || !position.id) ctx.throw(404, 'Position not found')
  ctx.position = position
  await next()
})

let checkOwner = async (ctx, next) => {
  let createdById = ctx.position && ctx.position.createdBy;
  let loggedUserId = ctx.session.user && ctx.session.user.id;
  if (!loggedUserId || !createdById || createdById != loggedUserId) ctx.throw(403)
  await next();
}

let setCreadBy = async (ctx, next) => {
  ctx.request.body.createdBy = ctx.session.user;
  await next();
}

router
  .get('/', async ctx => ctx.body = await Position.find({}))
  .post('/', setCreadBy, async ctx => ctx.body = await new Position(ctx.request.body).save())
  .get('/:id', async ctx => ctx.body = ctx.position)
  .put('/:id', checkOwner, async ctx => ctx.body = await ctx.position.update(ctx.request.body))
  .delete('/:id', checkOwner, async ctx => ctx.body = await ctx.position.remove())

export default router