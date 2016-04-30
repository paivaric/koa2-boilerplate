export default () => {
  return async (ctx, next) => {
    ctx.request.body.createdBy = ctx.request.body.updatedBy = ctx.session.user
    await next()
  }
}

