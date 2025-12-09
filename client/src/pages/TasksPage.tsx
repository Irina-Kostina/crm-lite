import { type FormEvent } from 'react'
import '../App.css'

export interface Task {
  id: number
  title: string
  done: boolean
}

interface TasksPageProps {
  tasks: Task[]
  newTaskTitle: string
  setNewTaskTitle: (value: string) => void
  onAddTask: (e: FormEvent) => void
  onToggleTask: (id: number) => void
  onRemoveTask: (id: number) => void
}

export default function TasksPage({
  tasks,
  newTaskTitle,
  setNewTaskTitle,
  onAddTask,
  onToggleTask,
  onRemoveTask,
}: TasksPageProps) {
  const completed = tasks.filter((t) => t.done).length

  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">
            Simple personal todo list for follow-ups, calls and reminders.
          </p>
        </div>
        <div className="page-actions">
          <span className="tasks-counter">
            {completed}/{tasks.length} done
          </span>
        </div>
      </section>

      <div className="cards-column">
        {/* Add task */}
        <section className="card">
          <h2 className="card-title">Add task</h2>
          <p className="card-subtitle">Create a quick reminder for yourself.</p>

          <form onSubmit={onAddTask} className="tasks-form">
            <input
              className="field-input tasks-input"
              placeholder="Call Alice about session time"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button type="submit" className="primary-button">
              Add task
            </button>
          </form>
        </section>

        {/* Список задач */}
        <section className="card">
          <h2 className="card-title">Your tasks</h2>

          {tasks.length === 0 ? (
            <p className="muted-text">
              No tasks yet. Add your first follow-up above.
            </p>
          ) : (
            <ul className="tasks-list">
              {tasks.map((task) => (
                <li key={task.id} className="task-item">
                  <label className="task-main">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => onToggleTask(task.id)}
                    />
                    <span
                      className={
                        task.done ? 'task-title task-title-done' : 'task-title'
                      }
                    >
                      {task.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    className="task-remove"
                    onClick={() => onRemoveTask(task.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
