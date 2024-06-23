import { FastifyInstance } from 'fastify'
import { checkUserIdIsValid } from '../middleware/check-user-id-is-valid'
import { knex } from '../database'
import { Meals } from '../types/Meals'
import { findBestDietSequence } from '../helpers/find-best-diet-sequence'

export async function metricsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUserIdIsValid)

  app.get('/', async (req, reply) => {
    const { userId } = req.cookies

    const meals: Meals[] = await knex('meals').where('user_id', userId)

    const metrics = meals.reduce(
      (acc, meal) => {
        if (meal.diet) {
          acc.diet += 1
        } else {
          acc.outDiet += 1
        }

        return acc
      },
      {
        diet: 0,
        outDiet: 0,
      },
    )

    const percentageValue = ((metrics.diet / meals.length) * 100).toFixed(2)
    const bestSequence = findBestDietSequence(meals)

    return reply.status(200).send({
      total: meals.length,
      diet: metrics.diet,
      outDiet: metrics.outDiet,
      percentageOnDiet: percentageValue + '%',
      bestSequence,
    })
  })
}
