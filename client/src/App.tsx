// src/App.tsx
import { type FormEvent, useEffect, useState } from 'react'

// Описываем тип клиента — он должен совпадать с тем, что на бэкенде
interface Client {
  id: number
  name: string
  email?: string
  phone?: string
  note?: string
  lastContacted: string
}

function App() {
  const [clients, setClients] = useState<Client[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. Загрузка клиентов при монтировании компонента
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('http://localhost:3001/clients')
        if (!res.ok) {
          throw new Error('Failed to load clients')
        }

        const data: Client[] = await res.json()
        setClients(data)
      } catch (err) {
        setError('Failed to load clients')
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  // 2. Обработчик отправки формы
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch('http://localhost:3001/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: email || undefined,
          phone: phone || undefined,
          note: note || undefined,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to add client')
      }

      const newClient: Client = await res.json()

      setClients((prev) => [...prev, newClient])

      // очищаем форму
      setName('')
      setEmail('')
      setPhone('')
      setNote('')
    } catch (err) {
      setError('Failed to add client')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1.5rem' }}>
      <h1>Client CRM Lite</h1>
      <p>Simple client manager for small NZ businesses (coaches, beauty, trainers).</p>

      <h2>Add new client</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Name:{' '}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Email:{' '}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Phone:{' '}
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Note:{' '}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <button type="submit">Add client</button>
      </form>

      {loading && <p>Loading clients…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Clients</h2>
      {clients.length === 0 ? (
        <p>No clients yet.</p>
      ) : (
        <table
          style={{ borderCollapse: 'collapse', width: '100%' }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Phone</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Note</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Last contacted</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{client.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{client.email}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{client.phone}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{client.note}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{client.lastContacted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
