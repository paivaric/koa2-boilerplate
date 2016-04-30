import Router from 'koa-router'
import Vacancy from './vacancy.model.js'

const router = new Router({
  prefix: '/vacancies'
})

router.param('id', async (id, ctx, next) => {
  let vacancy = await Vacancy.findOne().where('_id').equals(id).exec()
  if (!vacancy || !vacancy.id) ctx.throw(404, 'Vacancy not found')
  ctx.vacancy = vacancy
  await next()
})

let checkOwner = async (ctx, next) => {
  if (!ctx.session.userId) ctx.throw(401)
  let createdById = ctx.vacancy && ctx.vacancy.createdBy
  let loggedUserId = ctx.session.user && ctx.session.user.id
  if (!loggedUserId || !createdById || createdById != loggedUserId) ctx.throw(403)
  await next()
}

let createMongoQuery = async (ctx, next) => {
  ctx.mongoQuery = ctx.modifier(Vacancy.find(ctx.query).lean())
  await next()
}

router
  .get('/', createMongoQuery, async ctx => ctx.body = await ctx.mongoQuery.exec())
  .post('/', async ctx => ctx.body = await new Vacancy(ctx.request.body).save())
  .get('/:id', async ctx => ctx.body = ctx.vacancy)
  .put('/:id', checkOwner, async ctx => ctx.body = await ctx.vacancy.update(ctx.request.body))
  .delete('/:id', checkOwner, async ctx => ctx.body = await ctx.vacancy.remove())

export default router