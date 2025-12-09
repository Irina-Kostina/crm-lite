import { type FormEvent } from 'react'
import '../App.css'

// Types. Same as App.tsx
interface Client {
  id: number
  name: string
  email?: string
  phone?: string
  note?: string
  lastContacted: string
}

interface ClientsPageProps {
  clients: Client[]
  loading: boolean
  error: string | null
  name: string
  email: string
  phone: string
  note: string
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onNoteChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
  onScrollToForm: () => void
}

export default function ClientsPage({
  clients,
  loading,
  error,
  name,
  email,
  phone,
  note,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onNoteChange,
  onSubmit,
  onScrollToForm,
}: ClientsPageProps) {
  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="page-subtitle">
            Manage your client list and keep notes, synced with Google Sheets.
          </p>
        </div>
        <div className="page-actions">
          <button className="ghost-button" type="button" disabled>
            Filters
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={onScrollToForm}
          >
            + New client
          </button>
        </div>
      </section>

      <div className="cards-column">
        {/* Add client form */}
        <section id="new-client" className="card">
          <h2 className="card-title">Add new client</h2>
          <p className="card-subtitle">Quickly capture a new contact.</p>

          <form onSubmit={onSubmit} className="form-grid">
            <div className="form-field">
              <label className="field-label">
                Name <span className="required">*</span>
              </label>
              <input
                className="field-input"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
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
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="jane@example.com"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Phone</label>
              <input
                className="field-input"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="021 000 0000"
              />
            </div>

            <div className="form-field form-field-full">
              <label className="field-label">Note</label>
              <textarea
                className="field-input field-textarea"
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
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

        {/* Clients table*/}
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
            <p className="muted-text">
              No clients yet. Add your first one above.
            </p>
          )}
        </section>
      </div>
    </>
  )
}
