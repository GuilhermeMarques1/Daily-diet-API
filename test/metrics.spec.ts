import { execSync } from 'node:child_process'
import { it, describe, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'

describe('Metrics routes', () => {
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

  it('should get metrics of user', async () => {
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

    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'meal 2',
        description: 'lorem ipsum',
        date: '2024-06-21',
        time: '19:46:00',
        diet: false,
      })
      .expect(201)

    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'meal 3',
        description: 'lorem ipsum',
        date: '2024-06-22',
        time: '06:30:00',
        diet: true,
      })
      .expect(201)

    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'meal 4',
        description: 'lorem ipsum',
        date: '2024-06-22',
        time: '12:30:00',
        diet: true,
      })
      .expect(201)

    const getMetricsResponse = await supertest(app.server)
      .get('/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(getMetricsResponse.body).toEqual({
      total: 4,
      diet: 3,
      outDiet: 1,
      percentageOnDiet: '75.00%',
      bestSequence: 2,
    })
  })
})
