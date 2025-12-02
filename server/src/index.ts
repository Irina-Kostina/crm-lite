import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Client } from './types'

// Загружаем переменные окружения из .env (потом пригодится для Google)
dotenv.config()

// Создаём приложение Express
const app = express()

// Включаем CORS и JSON-парсер
app.use(cors())
app.use(express.json())

// Временное хранилище клиентов в памяти
let clients: Client[] = [
  {
    id: 1,
    name: 'Test Client',
    email: 'test@example.com',
    phone: '0212345678',
    note: 'First test client',
    lastContacted: '2025-12-01',
  },
]

// GET /clients — вернуть всех клиентов
app.get('/clients', (req: Request, res: Response) => {
  res.json(clients)
})

// POST /clients — добавить клиента
app.post('/clients', (req: Request, res: Response) => {
  const { name, email, phone, note } = req.body as {
    name: string
    email?: string
    phone?: string
    note?: string
  }

  if (!name) {
    return res.status(400).json({ message: 'Name is required' })
  }

  const newClient: Client = {
    id: clients.length + 1,
    name,
    email,
    phone,
    note,
    lastContacted: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
  }

  clients.push(newClient)

  return res.status(201).json(newClient)
})

// Запускаем сервер
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
