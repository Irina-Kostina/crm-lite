// src/pages/MessagesPage.tsx
import { type FormEvent } from 'react'
import '../App.css'

export interface Message {
  id: number
  title: string
  body: string
  createdAt: string // ISO-строка
}

interface MessagesPageProps {
  messages: Message[]
  newMessageTitle: string
  newMessageBody: string
  setNewMessageTitle: (value: string) => void
  setNewMessageBody: (value: string) => void
  onAddMessage: (e: FormEvent) => void
  onRemoveMessage: (id: number) => void
}

export default function MessagesPage({
  messages,
  newMessageTitle,
  newMessageBody,
  setNewMessageTitle,
  setNewMessageBody,
  onAddMessage,
  onRemoveMessage,
}: MessagesPageProps) {
  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">Notes</h1>
          <p className="page-subtitle">
            Global message feed for notes, follow-ups and manual logs.
          </p>
        </div>
      </section>

      <div className="cards-column">
        {/* Форма создания сообщения */}
        <section className="card">
          <h2 className="card-title">Add note</h2>
          <p className="card-subtitle">
            Log a follow-up, client update or any important note.
          </p>

          <form onSubmit={onAddMessage} className="messages-form">
            <input
              className="field-input messages-input-title"
              placeholder="Title (e.g. Follow-up sent to Jane)"
              value={newMessageTitle}
              onChange={(e) => setNewMessageTitle(e.target.value)}
            />
            <textarea
              className="field-input messages-input-body"
              placeholder="Optional details: what did you send, how did they respond, what to do next..."
              value={newMessageBody}
              onChange={(e) => setNewMessageBody(e.target.value)}
            />
            <div className="messages-actions">
              <button type="submit" className="primary-button">
                Add to feed
              </button>
            </div>
          </form>
        </section>

        {/* Лента сообщений */}
        <section className="card">
          <h2 className="card-title">Notes feed</h2>
          <p className="card-subtitle">
            Newest notes appear at the top. Stored locally in this browser.
          </p>

          {messages.length === 0 ? (
            <p className="muted-text">
              No messages yet. Log your first follow-up or note above.
            </p>
          ) : (
            <ul className="messages-list">
              {messages.map((message) => {
                const date = new Date(message.createdAt)
                const dateLabel = date.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
                const timeLabel = date.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <li key={message.id} className="message-item">
                    <div className="message-main">
                      <div className="message-title-row">
                        <span className="message-title">{message.title}</span>
                        <span className="message-meta">
                          {dateLabel} · {timeLabel}
                        </span>
                      </div>
                      {message.body && (
                        <p className="message-body">{message.body}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="message-remove"
                      onClick={() => onRemoveMessage(message.id)}
                    >
                      ✕
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
