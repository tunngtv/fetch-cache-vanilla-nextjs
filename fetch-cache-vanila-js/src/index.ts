import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 3333

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

let useCacheControl: boolean = false

app.get('/random-items', (req: Request, res: Response) => {
  if (useCacheControl) {
    res.set('Cache-Control', 'private, max-age=5')
  }

  res.json({
    items: [Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2)]
  })
})

app.post('/cache-control/on', (req: Request, res: Response) => {
  useCacheControl = true
  res.status(200).json({ message: 'Cache-Control enabled' })
})

app.post('/cache-control/off', (req: Request, res: Response) => {
  useCacheControl = false
  res.status(200).json({ message: 'Cache-Control disabled' })
})

app.listen(PORT, () => {
  console.log(`Test web server listening on port ${PORT}`)
})
