import basicAuth from 'basic-auth';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nconf from 'nconf'

import User from '../api/users/model'

export default async (ctx, next) => {
  let credentials = basicAuth(ctx)
  if (credentials) {
    ctx.session = ctx.session || {}
    let hashedPassword = crypto.createHash('sha1').update(credentials.pass + nconf.get('SALT')).digest('hex')
    ctx.session.user = await User.findOne()
      .where('email').equals(credentials.name || '')
      .where('hashedPassword').equals(hashedPassword)
      .exec()
    console.log('loggedUser', ctx.session.user)
  }
  console.log('credentials', credentials)
  await next()
}