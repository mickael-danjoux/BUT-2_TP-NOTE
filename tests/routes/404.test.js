import { describe, test, expect } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

describe('Test de l’endpoint 404', () => {
  test('Devrait renvoyer une erreur 404 pour une route non existante', async () => {
    const response = await request(app)
      .get('/route-qui-nexiste-pas')
      .set('Accept', 'application/json')

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Not found')
  })
})
