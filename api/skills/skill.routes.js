import Router from 'koa-router'
import SkillModel from './skill.model.js'

export default parent => {

  let Skill = SkillModel(parent)

  const router = new Router({
    prefix: `/${parent.toLowerCase()}-skills`
  })

  router.param('id', async (id, ctx, next) => {
    let skill = await Skill.findOne().where('_id').equals(id).exec()
    if (!skill) {
      ctx.throw = (404, 'Skill not found')
    } else {
      ctx.skill = skill
      await next()
    }
  })

  let setOwner = async (ctx, next) => {
    ctx.request.body.createdBy = ctx.session.user
    await next()
  }

  let checkOwner = async (ctx, next) => {
    if (!ctx.session.userId) ctx.throw(401)
    let createdById = ctx.skill && ctx.skill.createdBy
    let loggedUserId = ctx.session.user && ctx.session.user.id
    if (!loggedUserId || !createdById || createdById != loggedUserId) ctx.throw(403)
    await next()
  }

  let createMongoQuery = async (ctx, next) => {
    ctx.mongoQuery = ctx.modifier(Skill.find(ctx.query) )
    await next();
  }

  router
    .get('/', createMongoQuery, async ctx => ctx.body = await ctx.mongoQuery.exec())
    .post('/', setOwner, async ctx => ctx.body = await new Skill(ctx.request.body).save())
    .get('/:id', async ctx => ctx.body = ctx.skill)
    .put('/:id', checkOwner, async ctx => ctx.body = await ctx.skill.update(ctx.request.body))
    .delete('/:id', checkOwner, async ctx => ctx.body = await ctx.skill.remove())

  return router
}