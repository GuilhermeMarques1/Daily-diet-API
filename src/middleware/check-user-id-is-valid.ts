import { FastifyRequest, FastifyReply } from 'fastify'
import { knex } from '../database'

export async function checkUserIdIsValid(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = req.cookies.userId

    if (!userId) {
      return reply.status(401).send({
        error: 'Unauthorized',
      })
    }

    const userExist = await knex('users').where('id', userId).first()

    if (!userExist) {
      return reply.status(401).send({
        error: 'Unauthorized',
      })
    }
  } catch (error) {
    console.error('Error to authenticate', error)
    return reply.status(500).send('Error to authenticated')
  }
}
