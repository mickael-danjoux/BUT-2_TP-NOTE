import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { createTestUser } from './_utils.js'

describe('Test Login', () => {
  test('Devrait renvoyer 400', async () => {
    const response = await request(app)
      .post('/api/login')
      .set('Accept', 'application/json');

    expect([400, 422]).toContain(response.status);
      expect(typeof response.body).toBe('object');

  });
  test('Devrait renvoyer un token', async () => {
    const password = 'azertyuiop'
    const user = await createTestUser({
      email: "password@test.com",
      password
    });
    const response = await request(app)
      .post('/api/login')
      .send({
        email: user.email,
        password,
      })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('token')
  });
});
