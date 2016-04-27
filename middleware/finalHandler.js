import _ from 'lodash'

export default () => {
  return async (ctx, next) => {
    try {
      await next()
      if(ctx.status === 200) {
        switch (ctx.request.method) {
          case 'PUT':
            ctx.body = {}
            break
          case 'POST':
            ctx.status = 201
            ctx.body = {_id: ctx.body.id || ctx.body._id}
            break
          case 'DELETE':
            ctx.status = 204
            ctx.body = null
            break
        }
      }
    } catch (error) {
      if(error.errors && !error.status) {
        ctx.status = 400
        ctx.body = _.mapValues(error.errors, e => {return e.message})
      } else {
        ctx.status = error.status || 500
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