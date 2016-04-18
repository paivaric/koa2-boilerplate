import Koa from 'koa'
import mongoose from 'mongoose'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'kcors';
import logger from 'koa-logger'
import nconf from 'nconf'
import views from 'koa-views';

import homeRoutes from './api/home/routes'
import userRoutes from './api/users/routes'
import positionRoutes from './api/positions/routes'
import finalHandler from './finalHandler'
import config from './config'
import auth from './middleware/auth'

nconf
  .argv()
  .env()
  .defaults(config);

const app = new Koa()

mongoose.connect(nconf.get('MONGODB_URL'))

app.use(finalHandler());
app.use(bodyParser())
app.use(cors())
app.use(logger())

app.use(auth)

app.use(views(`${__dirname}/views`));

const api = Router({
  prefix: '/api/v1'
})

api.use(userRoutes.routes())
api.use(userRoutes.allowedMethods())
api.use(positionRoutes.routes())
api.use(positionRoutes.allowedMethods())


app.use(homeRoutes.routes())
app.use(homeRoutes.allowedMethods())
app.use(api.routes())
app.use(api.allowedMethods())



app.listen(8888, () => console.log('server started 8888'))

export default app

