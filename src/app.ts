import fastify from 'fastify'
import { userRoutes } from './routes/users'
import cookie from '@fastify/cookie'
import { mealRoutes } from './routes/meals'
import { metricsRoutes } from './routes/metrics'

export const app = fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: 'users',
})
app.register(mealRoutes, {
  prefix: 'meals',
})
app.register(metricsRoutes, {
  prefix: 'metrics',
})
