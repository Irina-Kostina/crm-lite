// src/pages/MessagesPage.tsx
import '../App.css'

export default function MessagesPage() {
  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">Messages</h1>
          <p className="page-subtitle">
            Placeholder page for future messaging or integrations.
          </p>
        </div>
      </section>

      <div className="cards-column">
        <section className="card">
          <h2 className="card-title">Coming soon</h2>
          <p className="card-subtitle">
            This space is reserved for email / WhatsApp / DM integrations.
          </p>
          <p className="muted-text">
            For now, keep all important context in the client notes on the
            Clients tab.
          </p>
        </section>
      </div>
    </>
  )
}
