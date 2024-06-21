import { execSync } from 'node:child_process'
import { it, describe, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'

describe('User routes', () => {
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

  it('should create user', async () => {
    await supertest(app.server)
      .post('/users')
      .send({
        name: 'Guilherme Câmara Marques',
        email: 'guilherme.dev@gmail.com',
        password: '123123',
      })
      .expect(201)
  })

  it('should login with a user', async () => {
    await supertest(app.server)
      .post('/users')
      .send({
        name: 'Guilherme Câmara Marques',
        email: 'guilherme.dev@gmail.com',
        password: '123123',
      })
      .expect(201)

    const loginUserResponse = await supertest(app.server)
      .post('/users/login')
      .send({
        email: 'guilherme.dev@gmail.com',
        password: '123123',
      })
      .expect(200)

    const cookies = loginUserResponse.get('Set-Cookie') || []

    expect(cookies).toBeDefined()
    expect(cookies.length).toBeGreaterThan(0)

    const userIdCookie = cookies.find((cookie) => cookie.startsWith('userId='))
    const userIdValue = userIdCookie?.split(';')[0].split('=')[1]

    expect(typeof userIdValue).toBe('string')
    expect(userIdValue).toBeTruthy() // Ensure userId is not empty
  })
})
