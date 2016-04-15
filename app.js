import Koa from 'koa'
import mongoose from 'mongoose'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'kcors';
import logger from 'koa-logger'

import homeRoutes from './api/home/routes'
import userRoutes from './api/users/routes'
import positionRoutes from './api/positions/routes'
import finalHandler from './finalHandler'
import views from 'koa-views';


const app = new Koa()

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/x-test')

app.use(finalHandler());
app.use(bodyParser())
app.use(cors())
app.use(logger())

app.use(views(`${__dirname}/views`));

const api = new Router({
  prefix: '/api/v1'
})

api.use(userRoutes.routes())
api.use(positionRoutes.routes())


app.use(homeRoutes.routes())
app.use(api.routes())
app.use(api.allowedMethods())

app.listen(8888, () => console.log('server started 8888'))

export default app

