import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })


const API_URL = process.env.API_URL

if (!API_URL) {
  console.error('API_URL er ikke defineret. Tjek .env-filen!')
  process.exit(1)
}

const app = express()
const port = 3000

app.use(cors())

app.get('/api/data', async (req, res) => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Ekstern API fejlede')
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('Fejl i server.js:', err.message)
    res.status(500).json({ error: 'Der opstod en fejl' })
  }
})

app.listen(port, () => {
  console.log(`✅ Proxy server kører på http://localhost:${port}`)
})
