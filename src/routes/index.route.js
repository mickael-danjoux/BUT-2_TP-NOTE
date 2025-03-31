import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API Express fonctionnelle',
  })
})


export default router
