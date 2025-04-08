import express from 'express'

// Import des routes
import indexRoutes from './routes/index.route.js'
import docRoutes from './routes/doc.routes.js'

// Initialiser l'application Express
const app = express()

// Middlewares
app.use(express.json()) // Parser JSON
app.use(express.urlencoded({ extended: true })) // Parser URL-encoded

// Routes
app.use('/', indexRoutes);

// Route de test de la BDD

// Route Login

// Route des Utilisateurs

// Route documentation
app.use('/', docRoutes);


// Middleware pour les routes non trouvées - doit être après toutes les routes

// Middleware de gestion des erreurs globales - doit être le dernier middleware

export default app
