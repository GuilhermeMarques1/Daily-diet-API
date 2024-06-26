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

  it('should get specific meal', async () => {
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

    const createMealResponse = await supertest(app.server)
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

    const { id } = createMealResponse.body

    const getMealResponse = await supertest(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', cookies)

    expect(getMealResponse.body).toEqual({
      id,
      name: 'meal 1',
      description: 'lorem ipsum',
      date: '2024-06-21',
      time: '15:40:00',
      diet: 1,
    })
  })

  it('should update a meal', async () => {
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

    const createMealResponse = await supertest(app.server)
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

    const { id } = createMealResponse.body

    await supertest(app.server)
      .put(`/meals/${id}`)
      .set('Cookie', cookies)
      .send({
        name: 'meal updated',
        description: 'lorem ipsum dolor sit amet',
        date: '2024-06-22',
        time: '20:30:00',
        diet: false,
      })
      .expect(200)

    const getMealResponse = await supertest(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', cookies)

    expect(getMealResponse.body).toEqual({
      id,
      name: 'meal updated',
      description: 'lorem ipsum dolor sit amet',
      date: '2024-06-22',
      time: '20:30:00',
      diet: 0,
    })
  })

  it('should delete a meal', async () => {
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

    const createMealResponse = await supertest(app.server)
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

    const { id } = createMealResponse.body

    await supertest(app.server)
      .delete(`/meals/${id}`)
      .set('Cookie', cookies)
      .expect(200)
  })
})
