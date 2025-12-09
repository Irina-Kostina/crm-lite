import { type FormEvent, useEffect, useState } from 'react'
import './App.css'

import ClientsPage from './pages/ClientsPage'
import TasksPage, { type Task } from './pages/TasksPage'
import MessagesPage, { type Message } from './pages/MessagesPage'

type Page = 'clients' | 'tasks' | 'messages'

// Client Type
interface Client {
  id: number
  name: string
  email?: string
  phone?: string
  note?: string
  lastContacted: string
}

function App() {
  const [activePage, setActivePage] = useState<Page>('clients')

  // --- Clients state ---
  const [clients, setClients] = useState<Client[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- Tasks state ---
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  // --- Messages state (global feed) ---
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessageTitle, setNewMessageTitle] = useState('')
  const [newMessageBody, setNewMessageBody] = useState('')

  // --------- LOAD CLIENTS ONCE ----------
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

  // --------- CLIENTS: SUBMIT FORM ----------
  const handleSubmitClient = async (e: FormEvent) => {
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

  const scrollToForm = () => {
    const el = document.getElementById('new-client')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // --------- TASKS: LOGIC ----------
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault()
    const title = newTaskTitle.trim()
    if (!title) return

    const newTask: Task = {
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      title,
      done: false,
    }

    setTasks((prev) => [...prev, newTask])
    setNewTaskTitle('')
  }

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
  }

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  // --------- MESSAGES: LOGIC ----------
  const handleAddMessage = (e: FormEvent) => {
    e.preventDefault()
    const title = newMessageTitle.trim()
    const body = newMessageBody.trim()
    if (!title && !body) return

    const now = new Date()
    const createdAt = now.toISOString()

    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1

    const newMessage: Message = {
      id: nextId,
      title: title || '(no title)',
      body,
      createdAt,
    }

    setMessages((prev) => [newMessage, ...prev])

    setNewMessageTitle('')
    setNewMessageBody('')
  }

  const handleRemoveMessage = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  // --------- RENDER ---------
  const currentPageLabel =
    activePage === 'clients'
      ? 'Clients'
      : activePage === 'tasks'
      ? 'Tasks'
      : 'Notes'

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">CRM</div>

        <nav className="sidebar-nav">
          <button
            type="button"
            aria-label="Clients"
            className={
              activePage === 'clients'
                ? 'sidebar-item sidebar-item-active'
                : 'sidebar-item'
            }
            onClick={() => setActivePage('clients')}
          >
            C
          </button>

          <button
            type="button"
            aria-label="Tasks"
            className={
              activePage === 'tasks'
                ? 'sidebar-item sidebar-item-active'
                : 'sidebar-item'
            }
            onClick={() => setActivePage('tasks')}
          >
            ✓
          </button>

          <button
            type="button"
            aria-label="Messages"
            className={
              activePage === 'messages'
                ? 'sidebar-item sidebar-item-active'
                : 'sidebar-item'
            }
            onClick={() => setActivePage('messages')}
          >
            ✎
          </button>
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-footer-tag">NZ</span>
        </div>
      </aside>

      {/* Shell */}
      <div className="shell">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-app">Client CRM Lite</span>
            <span className="topbar-divider">/</span>
            <span className="topbar-page">{currentPageLabel}</span>
          </div>
          <div className="topbar-right">
            <input
              className="topbar-search"
              placeholder="Search (UI only)"
              disabled
            />
            <div className="topbar-avatar">IK</div>
          </div>
        </header>

        {/* Page content */}
        <main className="content">
          {activePage === 'clients' && (
            <ClientsPage
              clients={clients}
              loading={loading}
              error={error}
              name={name}
              email={email}
              phone={phone}
              note={note}
              onNameChange={setName}
              onEmailChange={setEmail}
              onPhoneChange={setPhone}
              onNoteChange={setNote}
              onSubmit={handleSubmitClient}
              onScrollToForm={scrollToForm}
            />
          )}

          {activePage === 'tasks' && (
            <TasksPage
              tasks={tasks}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              onAddTask={handleAddTask}
              onToggleTask={toggleTask}
              onRemoveTask={removeTask}
            />
          )}

          {activePage === 'messages' && (
            <MessagesPage
              messages={messages}
              newMessageTitle={newMessageTitle}
              newMessageBody={newMessageBody}
              setNewMessageTitle={setNewMessageTitle}
              setNewMessageBody={setNewMessageBody}
              onAddMessage={handleAddMessage}
              onRemoveMessage={handleRemoveMessage}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
