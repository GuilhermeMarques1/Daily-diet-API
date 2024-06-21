import { execSync } from 'node:child_process'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { app } from '../src/app'
import { beforeEach } from 'node:test'
import supertest from 'supertest'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('yarn knex migrate:rollback --all')
    execSync('yarn knex migrate:latest')
  })

  it('should create a meal', async () => {
    await supertest(app.server)
      .post('/users')
      .send({
        name: 'User test',
        email: 'test@dev.com',
        password: 'pass123',
      })
      .expect(201)

    const loginUserResponse = await supertest(app.server)
      .post('/users/login')
      .send({
        email: 'test@dev.com',
        password: 'pass123',
      })
      .expect(200)

    const cookies = loginUserResponse.get('Set-Cookie') || []

    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'meal 1',
        description: 'lorem ipsum',
        date: '2024-06-21',
        time: '15:40:00',
        diet: true,
      })
      .expect(201)
  })
})
