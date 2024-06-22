import { execSync } from 'node:child_process'
import { it, describe, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'

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

  it('should get all meals', async () => {
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
        date: '2024-06-22',
        time: '19:46:00',
        diet: false,
      })
      .expect(201)

    const getAllMealsResponse = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(getAllMealsResponse.body).toEqual([
      expect.objectContaining({
        name: 'meal 1',
        description: 'lorem ipsum',
        date: '2024-06-21',
        time: '15:40:00',
        diet: 1,
      }),
      expect.objectContaining({
        name: 'meal 2',
        description: 'lorem ipsum',
        date: '2024-06-22',
        time: '19:46:00',
        diet: 0,
      }),
    ])
  })
})
