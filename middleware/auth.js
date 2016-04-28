import basicAuth from 'basic-auth'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import nconf from 'nconf'

import User from '../api/users/user.model'

export default async (ctx, next) => {
  let credentials = basicAuth(ctx)
  ctx.session = ctx.session || {}
  if (credentials) {
    let hashedPassword = crypto.createHash('sha1').update(credentials.pass + nconf.get('SALT')).digest('hex')
    ctx.session.user = await User.findOne()
      .where('email').equals(credentials.name || '')
      .where('hashedPassword').equals(hashedPassword)
      .exec()
    ctx.session.userId = ctx.session.user && ctx.session.user.id
  }
  await next()
}