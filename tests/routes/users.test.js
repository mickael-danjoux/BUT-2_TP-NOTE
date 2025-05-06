import { describe, test, expect, afterEach, afterAll, beforeAll } from '@jest/globals'
import request from 'supertest';
import app from '../../src/app.js';
import { User } from '../../src/database/models/user.model.js';
import bcrypt from 'bcrypt';
import { createTestUser } from './_utils.js'



describe('Tests des endpoints utilisateurs', () => {
  // Données de test réutilisables
  const validData = {
    firstName: 'John',
    lastName: 'DOE',
    birthDate: '1990-01-01',
    password: 'Azerty1%',
  };
  const testUsers = {
    valid: validData,
    underage: {
      ...validData,
      birthDate: '2015-01-01',
    },
    tooShortPassword: {
      ...validData,
      password: 'aze'
    },
    incomplete: {
      email: 'john.doe@example.com',
    },
  };

  describe('GET /api/users', () => {
    test('Devrait lister tous les utilisateurs', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    test('Devrait créer un nouvel utilisateur avec des données valides', async () => {
      const data = {
        ...testUsers.valid,
        email: `test.${Date.now()}.${Math.random().toString(36).substring(2)}@example.com`
      }
      const response = await request(app)
        .post('/api/users')
        .send(data)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe(data.firstName);
      expect(response.body.lastName).toBe(data.lastName);
      expect(response.body.email).toBe(data.email);
    });

    test('Devrait rejeter un utilisateur trop jeune', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(testUsers.underage)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect([400, 422]).toContain(response.status);
        expect(typeof response.body).toBe('object');
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    test('Devrait rejeter un utilisateur avec des données incomplètes', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(testUsers.incomplete)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect([400, 422]).toContain(response.status);
        expect(typeof response.body).toBe('object');
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    test('Devrait retourner que le mot de passe ne convient pas', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(testUsers.tooShortPassword)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect([400, 422]).toContain(response.status);
        expect(typeof response.body).toBe('object');
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    test('Devrait rejeter un utilisateur avec un email déjà existant', async () => {
      // Créer d'abord un utilisateur
      const existingUser = await createTestUser();

      // Tenter de créer un utilisateur avec le même email
      const response = await request(app)
        .post('/api/users')
        .send(existingUser)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect([400, 409, 422]).toContain(response.status);
        expect(typeof response.body).toBe('object');
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:id', () => {
    test('Devrait récupérer un utilisateur spécifique', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get(`/api/users/${user.id}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(user.id);
      expect(response.body.firstName).toBe(user.firstName);
      expect(response.body.lastName).toBe(user.lastName);
      expect(response.body.email).toBe(user.email);
      expect(response.body.password).toBe(undefined);
      expect(response.body.createdAt).toBe(undefined);
      expect(response.body.birthDate).toBe(undefined);
    });

    test('Devrait renvoyer 404 pour un ID inexistant', async () => {
      const response = await request(app)
        .get('/api/users/99999')
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/users/:id', () => {
    test('Devrait mettre à jour un utilisateur', async () => {
      const user = await createTestUser();

      const updatedData = {
        firstName: 'Mikey',
        lastName: 'Does',
      };

      const response = await request(app)
        .patch(`/api/users/${user.id}`)
        .send(updatedData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(user.id);
      expect(response.body.firstName).toBe(updatedData.firstName);
      expect(response.body.lastName).toBe(updatedData.lastName);
      expect(response.body.email).toBe(user.email); // Email ne devrait pas changer
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('Devrait supprimer un utilisateur', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .delete(`/api/users/${user.id}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(204);

      // Vérifier que l'utilisateur a bien été supprimé
      const deletedUser = await User.findByPk(user.id);
      expect(deletedUser).toBe(null);
    });
  });
});
