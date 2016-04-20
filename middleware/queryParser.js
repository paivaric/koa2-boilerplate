import queryModifier from 'get-query-modifier'

export default () => {
  return async (ctx, next) => {
    ctx.modifier = queryModifier(ctx.query)
    await next()
  }
}
