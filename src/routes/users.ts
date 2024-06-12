import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    try {
      const userBodySchema = z.object({
        name: z.string(),
        email: z.string(),
      })

      const { name, email } = userBodySchema.parse(req.body)

      const emailExists = await knex('users').where('email', email).first()

      if (emailExists) {
        return reply
          .status(400)
          .send('The user with this email is already registered')
      }

      await knex('users').insert({
        id: randomUUID(),
        name,
        email,
      })

      return reply.status(201).send()
    } catch (error) {
      console.error('Error to create user: ', error)
      return reply.status(500).send('Error to create user')
    }
  })
}
