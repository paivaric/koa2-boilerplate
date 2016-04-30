import Koa from 'koa'
import mongoose from 'mongoose'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'kcors'
import logger from 'koa-logger'
import nconf from 'nconf'
import views from 'koa-views'

import homeRoutes from './api/home/home.routes'
import userRoutes from './api/users/user.routes'
import positionRoutes from './api/positions/position.routes'
import SkillRoutes from './api/skills/skill.routes'
import finalHandler from './middleware/finalHandler'
import auth from './middleware/auth'
import by from './middleware/by'
import queryParser from './middleware/queryParser'
import config from './config'

nconf
  .argv()
  .env()
  .defaults(config)

const app = new Koa()

mongoose.connect(nconf.get('MONGODB_URL'))
if (nconf.get('DEBUG')) mongoose.set('debug', true)

app.use(finalHandler())
app.use(queryParser())
app.use(bodyParser())
app.use(cors())
app.use(logger())

app.use(auth())
app.use(by())

app.use(views(`${__dirname}/views`))

const api = Router({
  prefix: '/api/v1'
})

api.use(userRoutes.routes())
api.use(userRoutes.allowedMethods())
api.use(positionRoutes.routes())
api.use(positionRoutes.allowedMethods())

const userSkillsRoutes = SkillRoutes('User')
api.use(userSkillsRoutes.routes())
api.use(userSkillsRoutes.allowedMethods())

const positionSkillsRoutes = SkillRoutes('Position')
api.use(positionSkillsRoutes.routes())
api.use(positionSkillsRoutes.allowedMethods())

app.use(homeRoutes.routes())
app.use(homeRoutes.allowedMethods())
app.use(api.routes())
app.use(api.allowedMethods())



app.listen(8888, () => console.log('server started 8888'))

export default app

