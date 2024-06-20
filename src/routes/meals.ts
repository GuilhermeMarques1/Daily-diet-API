import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    try {
      const mealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string().date(), // YYYY-MM-DD
        time: z.string().time(), // HH:MM:SS[.s+]
        diet: z.boolean(),
      })

      const { name, description, date, time, diet } = mealBodySchema.parse(
        req.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        date,
        time,
        diet,
      })

      return reply.status(201).send()
    } catch (error) {
      console.error('Error to create meal: ', error)
      return reply.status(500).send('Error to create meal')
    }
  })
}
