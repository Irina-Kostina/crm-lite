// server/src/googleSheets.ts
import path from 'path'
import dotenv from 'dotenv'
import { google } from 'googleapis'
import { Client } from './types'

// Загружаем переменные окружения здесь, до чтения process.env
dotenv.config()

// Путь к JSON-ключу сервисного аккаунта
const keyFile = path.join(__dirname, '..', 'service-account-key.json')

// Настройки таблицы из .env
const SPREADSHEET_ID = process.env.SPREADSHEET_ID as string
const SHEET_NAME = process.env.SHEET_NAME || 'Sheet1'

if (!SPREADSHEET_ID) {
  throw new Error('SPREADSHEET_ID missing in .env')
}

// Настраиваем авторизацию Google
const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

// Прочитать всех клиентов из Google Sheets
export async function getClientsFromSheet(): Promise<Client[]> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A2:F`,
  })

  const rows = res.data.values || []

  const clients: Client[] = rows.map((row) => {
    const [idStr, name, email, phone, note, last] = row

    return {
      id: Number(idStr),
      name: name || '',
      email: email || '',
      phone: phone || '',
      note: note || '',
      lastContacted: last || '',
    }
  })

  return clients
}

// Добавить клиента в Google Sheets
export async function addClientToSheet(input: {
  name: string
  email?: string
  phone?: string
  note?: string
}): Promise<Client> {
  const existing = await getClientsFromSheet()

  // Берём последний элемент массива без .at(), чтобы TS не ругался
  const lastClient =
    existing.length > 0 ? existing[existing.length - 1] : undefined
  const newId = (lastClient?.id || 0) + 1

  const lastContacted = new Date().toISOString().substring(0, 10) // YYYY-MM-DD

  const newClient: Client = {
    id: newId,
    name: input.name,
    email: input.email || '',
    phone: input.phone || '',
    note: input.note || '',
    lastContacted,
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A2:F`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        [
          newClient.id,
          newClient.name,
          newClient.email,
          newClient.phone,
          newClient.note,
          newClient.lastContacted,
        ],
      ],
    },
  })

  return newClient
}
