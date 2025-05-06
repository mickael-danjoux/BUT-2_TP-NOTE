import { describe, test, expect } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

describe('Test Index', () => {
  test('Devrait renvoyer 200', async () => {
    const response = await request(app)
      .get('/')
      .set('Accept', 'application/json')

    expect(response.status).toBe(200)
  })
})
