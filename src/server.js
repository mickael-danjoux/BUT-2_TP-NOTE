import app from './app.js'
import dotenv from 'dotenv'

dotenv.config()
// Définir le port
const PORT = process.env.PORT || 3000

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`)
})
