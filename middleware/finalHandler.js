import _ from 'lodash'

export default () => {
  return async (ctx, next) => {
    try {
      switch (ctx.request.method) {
        case 'PUT':
          ctx.status = 200
          break
        case 'POST':
          ctx.status = 201
          break
        case 'DELETE':
          ctx.status = 204
          break
      }
      await next()
      if (ctx.status == 201) ctx.body = {_id: ctx.body.id || ctx.body._id}
    } catch (error) {
      if(error.errors && !error.status) {
        ctx.status = 400
        ctx.body = _.mapValues(error.errors, e => {return e.message})
      } else {
        ctx.status = error.status || 500;
      }
      // if (ctx.status === 404) {
      //   await ctx.render('error/404', { error })
      // } else {
      //   await ctx.render('error/error', { error })
      // }
      ctx.app.emit('error', error, ctx)
    }
  }
}