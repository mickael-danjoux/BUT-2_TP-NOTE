import express from 'express'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import yaml from 'js-yaml'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const router = express.Router()
import swaggerUi from 'swagger-ui-express'

// Charger le fichier YAML
try {
  // Construire le chemin vers le fichier YAML
  const swaggerPath = join(__dirname, '../doc/swagger.yaml')

  // Lire et parser le fichier YAML
  const swaggerDocument = yaml.load(readFileSync(swaggerPath, 'utf8'))

  // Configurer Swagger UI
  router.use('/api/doc', swaggerUi.serve)
  router.get('/api/doc', swaggerUi.setup(swaggerDocument))
} catch (error) {
  console.error('Erreur lors du chargement du fichier swagger.yaml:', error)
}


export default router
