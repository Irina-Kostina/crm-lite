// src/App.tsx
import { type FormEvent, useEffect, useState } from 'react'
import './App.css' 

// Тип клиента — тот же, что и на бэкенде
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

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('http://localhost:3001/clients')
        if (!res.ok) throw new Error('Failed to load clients')

        const data: Client[] = await res.json()
        setClients(data)
      } catch {
        setError('Failed to load clients')
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch('http://localhost:3001/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: email || undefined,
          phone: phone || undefined,
          note: note || undefined,
        }),
      })

      if (!res.ok) throw new Error('Failed to add client')

      const newClient: Client = await res.json()
      setClients((prev) => [...prev, newClient])

      setName('')
      setEmail('')
      setPhone('')
      setNote('')
    } catch {
      setError('Failed to add client')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Client CRM Lite</h1>
        <p className="app-subtitle">
          Simple client manager for small NZ businesses (coaches, beauty, trainers).
        </p>
      </header>

      <main className="app-main">
        {/* Форма */}
        <section className="card">
          <h2 className="card-title">Add new client</h2>
          <p className="card-subtitle">Quickly capture a new contact.</p>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-field">
              <label className="field-label">
                Name <span className="required">*</span>
              </label>
              <input
                className="field-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Doe"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Email</label>
              <input
                className="field-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Phone</label>
              <input
                className="field-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="021 000 0000"
              />
            </div>

            <div className="form-field form-field-full">
              <label className="field-label">Note</label>
              <textarea
                className="field-input field-textarea"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How did they find you, what do they need help with..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                Save client
              </button>
            </div>
          </form>
        </section>

        {/* Таблица клиентов */}
        <section className="card">
          <div className="card-header-row">
            <div>
              <h2 className="card-title">Clients</h2>
              <p className="card-subtitle">
                {clients.length === 0
                  ? 'No clients yet.'
                  : `${clients.length} ${
                      clients.length === 1 ? 'client' : 'clients'
                    } in total.`}
              </p>
            </div>
          </div>

          {loading && <p className="muted-text">Loading clients…</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && clients.length > 0 && (
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Note</th>
                  <th>Last contacted</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="name-cell">
                        <div className="avatar-pill">
                          {client.name
                            .split(' ')
                            .filter(Boolean)
                            .map((part) => part[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <span>{client.name}</span>
                      </div>
                    </td>
                    <td>{client.email || '—'}</td>
                    <td>{client.phone || '—'}</td>
                    <td className="note-cell">{client.note || '—'}</td>
                    <td>
                      <span className="pill-muted">
                        {client.lastContacted || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && !error && clients.length === 0 && (
            <p className="muted-text">No clients yet. Add your first one above.</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
