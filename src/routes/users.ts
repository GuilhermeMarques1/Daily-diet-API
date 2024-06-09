import { FastifyInstance } from 'fastify'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async () => {
    console.log('user')
  })
}
