export default () => {
  return async (ctx, next) => {
    try {
      await next();
      var status = ctx.status || 404
      if (status === 404) ctx.throw(404)
    } catch (error) {
      console.error(error);
      ctx.status = error.status || 500;
      if (ctx.status === 404) {
        await ctx.render('error/404', { error })
      } else {
        await ctx.render('error/error', { error })
      }
      ctx.app.emit('error', error, ctx)
    }
  };
}