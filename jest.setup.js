import { afterAll, beforeAll } from '@jest/globals'
import { sequelize } from './src/database/database.js'

beforeAll(async () => {
  await sequelize.sync({ force: true });

});

// Code à exécuter après tous les tests
afterAll(async () => {
  await sequelize.close();
});
