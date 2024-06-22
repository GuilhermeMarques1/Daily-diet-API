import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkUserIdIsValid } from '../middleware/check-user-id-is-valid'

export async function mealRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUserIdIsValid)

  app.get('/', async (req, reply) => {
    try {
      const { userId } = req.cookies

      const meals =
        (await knex('meals')
          .select('id', 'name', 'description', 'date', 'time', 'diet')
          .where('user_id', userId)) || []

      return reply.status(200).send(meals)
    } catch (error) {
      console.error('Error to get all meals: ', error)
      return reply.status(500).send('Error to get all meals')
    }
  })

  app.get('/:id', async (req, reply) => {
    try {
      const mealGetParamsSchema = z.object({
        id: z.string(),
      })

      const { id } = mealGetParamsSchema.parse(req.params)

      const { userId } = req.cookies

      const meal = await knex('meals')
        .select('id', 'name', 'description', 'date', 'time', 'diet')
        .where('id', id)
        .andWhere('user_id', userId)

      return reply.status(200).send(meal)
    } catch (error) {}
  })

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

      const { userId } = req.cookies
      const id = randomUUID()

      await knex('meals').insert({
        id,
        name,
        description,
        date,
        time,
        diet,
        user_id: userId,
      })

      return reply.status(201).send({
        id,
      })
    } catch (error) {
      console.error('Error to create meal: ', error)
      return reply.status(500).send('Error to create meal')
    }
  })

  app.put('/:id', async (req, reply) => {
    try {
      const mealUpdateParamsSchema = z.object({
        id: z.string(),
      })

      const { id } = mealUpdateParamsSchema.parse(req.params)

      if (!id) {
        return reply.status(400).send('Id is missing')
      }

      const { userId } = req.cookies

      const mealToUpdate = await knex('meals')
        .where('id', id)
        .andWhere('user_id', userId)
        .first()

      if (!mealToUpdate) {
        return reply.status(400).send('Meal was not found')
      }

      const mealUpdateBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string().date(),
        time: z.string().time(),
        diet: z.boolean(),
      })

      const { name, description, date, time, diet } =
        mealUpdateBodySchema.parse(req.body)

      await knex('meals').where('id', id).update({
        name,
        description,
        date,
        time,
        diet,
      })
    } catch (error) {
      console.error('Error to update meal: ', error)
      return reply.status(500).send('Error to update meal')
    }
  })

  app.delete('/:id', async (req, reply) => {
    try {
      const mealDeleteParamsSchema = z.object({
        id: z.string(),
      })

      const { id } = mealDeleteParamsSchema.parse(req.params)

      if (!id) {
        return reply.status(400).send('Id is missing')
      }

      const { userId } = req.cookies

      const mealToDelete = await knex('meals')
        .where('id', id)
        .andWhere('user_id', userId)
        .first()

      if (!mealToDelete) {
        return reply.status(400).send('Meal was not found')
      }

      await knex('meals').where('id', id).delete()
    } catch (error) {
      console.error('Error to delete meal', error)
      return reply.status(500).send('Error to delete meal')
    }
  })
}
