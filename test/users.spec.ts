import { execSync } from 'node:child_process'
import { it, describe, beforeAll, afterAll, beforeEach } from 'vitest'
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
      })
      .expect(201)
  })
})
