import { describe, test, expect } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'
import { createTestPost, createTestUser } from './_utils.js'
import { Post } from '../../src/database/models/post.model.js'


describe('Tests des endpoints posts', () => {
  // Données de test réutilisables
  const validData = {
    title: 'Test Post',
    content: 'This is the content of the test post, which is long enough.',
    published: true,
  }

  const testPosts = {
    valid: validData,
    shortTitle: {
      ...validData,
      title: 'Te',  // Moins de 3 caractères
    },
    longTitle: {
      ...validData,
      title: 'A'.repeat(101),  // Plus de 100 caractères
    },
    noTitle: {
      content: validData.content,
      published: validData.published,
    },
    noContent: {
      title: validData.title,
      published: validData.published,
    },
  }


  describe('GET /api/posts', () => {
    test('Devrait lister tous les posts', async () => {
      const response = await request(app)
        .get('/api/posts')
        .set('Accept', 'application/json')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('POST /api/posts', () => {
    test('Devrait créer un nouveau post avec des données valides', async () => {
      const testUser = await createTestUser()
      const postData = {
        ...testPosts.valid,
        userId: testUser.id,
      }

      const response = await request(app)
        .post('/api/posts')
        .send(postData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.title).toBe(postData.title)
      expect(response.body.content).toBe(postData.content)
      expect(response.body.published).toBe(postData.published)
    })


    test('Devrait rejeter un post avec un titre trop court', async () => {
      const testUser = await createTestUser()

      const postData = {
        ...testPosts.shortTitle,
        userId: testUser.id,
      }

      const response = await request(app)
        .post('/api/posts')
        .send(postData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')

      expect([400, 422]).toContain(response.status)
      expect(typeof response.body).toBe('object')
      expect(response.body.errors.length).toBeGreaterThan(0)
    })
    test('Devrait rejeter un post avec un titre trop long', async () => {
      const testUser = await createTestUser()

      const postData = {
        ...testPosts.longTitle,
        userId: testUser.id,
      }

      const response = await request(app)
        .post('/api/posts')
        .send(postData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')

      expect([400, 422]).toContain(response.status)
      expect(typeof response.body).toBe('object')
      expect(response.body.errors.length).toBeGreaterThan(0)
    })

    test('Devrait rejeter un post sans titre', async () => {
      const testUser = await createTestUser()

      const postData = {
        ...testPosts.noTitle,
        userId: testUser.id,
      }

      const response = await request(app)
        .post('/api/posts')
        .send(postData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')

      expect([400, 422]).toContain(response.status)
      expect(typeof response.body).toBe('object')
      expect(response.body.errors.length).toBeGreaterThan(0)
    })

      test('Devrait rejeter un post sans contenu', async () => {
        const testUser = await createTestUser()

        const postData = {
          ...testPosts.noContent,
          userId: testUser.id
        };

        const response = await request(app)
          .post('/api/posts')
          .send(postData)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json');

        expect([400, 422]).toContain(response.status);
        expect(typeof response.body).toBe('object');
        expect(response.body.errors.length).toBeGreaterThan(0);
      });

      test('Devrait rejeter un post avec un userId inexistant', async () => {
        const postData = {
          ...testPosts.valid,
          userId: 99999  // ID inexistant
        };

        const response = await request(app)
          .post('/api/posts')
          .send(postData)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json');

        expect([400, 422]).toContain(response.status);
        expect(typeof response.body).toBe('object');
        expect(response.body.errors.length).toBeGreaterThan(0);
      });

    describe('GET /api/posts/:id', () => {
      test('Devrait récupérer un post spécifique', async () => {
        const user = await createTestUser();
        const post = await createTestPost(testPosts.valid, user);

        const response = await request(app)
          .get(`/api/posts/${post.id}`)
          .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(post.id);
        expect(response.body.title).toBe(post.title);
        expect(response.body.content).toBe(post.content);
        expect(response.body.published).toBe(post.published);
        expect(response.body.User).toHaveProperty('id', user.id);
      });

      test('Devrait renvoyer 404 pour un ID inexistant', async () => {
        const response = await request(app)
          .get('/api/posts/99999')
          .set('Accept', 'application/json');

        expect(response.status).toBe(404);
      });
    });

    describe('PATCH /api/posts/:id', () => {
      test('Devrait mettre à jour un post', async () => {
        const user = await createTestUser();
        const post = await createTestPost(testPosts.valid, user);

        const updatedData = {
          title: 'Updated Title',
          content: 'This is the updated content of the post.'
        };

        const response = await request(app)
          .patch(`/api/posts/${post.id}`)
          .send(updatedData)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(post.id);
        expect(response.body.title).toBe(updatedData.title);
        expect(response.body.content).toBe(updatedData.content);
        expect(response.body.published).toBe(post.published); // Ne devrait pas changer
      });
    });

    describe('DELETE /api/posts/:id', () => {
      test('Devrait supprimer un post', async () => {
        const user = await createTestUser();
        const post = await createTestPost(testPosts.valid, user);

        const response = await request(app)
          .delete(`/api/posts/${post.id}`)
          .set('Accept', 'application/json');

        expect(response.status).toBe(204);

        // Vérifier que le post a bien été supprimé
        const deletedPost = await Post.findByPk(post.id);
        expect(deletedPost).toBe(null);
      });
    });

    describe('CASCADE DELETE', () => {
      test('Les posts devraient être supprimés quand l\'utilisateur est supprimé', async () => {
        const user = await createTestUser();
        const post1 = await createTestPost(testPosts.valid, user);
        const post2 = await createTestPost(testPosts.valid, user);

        // Vérifier que les posts existent
        const postsBeforeUserDelete = await Post.findAll({ where: { userId: user.id } });
        expect(postsBeforeUserDelete.length).toBe(2);

        // Supprimer l'utilisateur
        await request(app)
          .delete(`/api/users/${user.id}`)
          .set('Accept', 'application/json');

        // Vérifier que les posts ont été supprimés
        const postsAfterUserDelete = await Post.findAll({ where: { userId: user.id } });
        expect(postsAfterUserDelete.length).toBe(0);

        // Vérifier individuellement
        const checkPost1 = await Post.findByPk(post1.id);
        const checkPost2 = await Post.findByPk(post2.id);
        expect(checkPost1).toBe(null);
        expect(checkPost2).toBe(null);
      });
    });

  })
  describe('GET /api/posts/:id', () => {
    test('Devrait renvoyer un post', async () => {
      const post = await createTestPost()
      const response = await request(app)
        .get(`/api/posts/${post.id}`)
        .set('Accept', 'application/json')

      expect(response.status).toBe(200)
      expect(response.body.id).toBe(post.id)
    })
  })
})
