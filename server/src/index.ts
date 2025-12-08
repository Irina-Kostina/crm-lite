import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getClientsFromSheet, addClientToSheet } from './googleSheets'


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// =============================
// GET /clients — all clients from Google Sheets
// =============================
app.get('/clients', async (req: Request, res: Response) => {
  try {
    const clients = await getClientsFromSheet()
    res.json(clients)
  } catch (err) {
    console.error('Error loading clients:', err)
    res.status(500).json({ message: 'Failed to load clients' })
  }
})

// =============================
// POST /clients — add client to Google Sheets
// =============================
app.post('/clients', async (req: Request, res: Response) => {
  const { name, email, phone, note } = req.body as {
    name: string
    email?: string
    phone?: string
    note?: string
  }

  if (!name) {
    return res.status(400).json({ message: 'Name is required' })
  }

  try {
    const newClient = await addClientToSheet({ name, email, phone, note })
    return res.status(201).json(newClient)
  } catch (err) {
    console.error('Error adding client:', err)
    return res.status(500).json({ message: 'Failed to add client' })
  }
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
