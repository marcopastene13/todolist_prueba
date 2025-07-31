import React, { useEffect, useState } from 'react'

function TaskList() {
  const [tasks, setTasks] = useState([]) // Estado para lista
  const [error, setError] = useState('') // Estado para error
  const [newTaskLabel, setNewTaskLabel] = useState('') // Estado para nueva tarea

  // Obtener tareas del backend
  const fetchTasks = async () => {
    const token = localStorage.getItem('token') // Token JWT
    try {
      const res = await fetch('http://127.0.0.1:5000/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        throw new Error('Error al obtener tareas') 
      }
      const data = await res.json()
      if (Array.isArray(data.tasks)) {
        setTasks(data.tasks)
      } else if (Array.isArray(data)) {
        setTasks(data)
      } else {
        setTasks([])
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // Carga tareas
  useEffect(() => {
    fetchTasks()
  }, [])

  // Tarea completada 
  const toggleComplete = async (id, completed) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://127.0.0.1:5000/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      })
      if (!res.ok) {
        throw new Error('Error al actualizar tarea')
      }
      setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !completed } : t)))
    } catch (err) {
      setError(err.message)
    }
  }

  // Eliminar tarea
  const deleteTask = async id => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://127.0.0.1:5000/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        throw new Error('Error al eliminar tarea')
      }
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  // Crear nueva tarea
  const handleAddTask = async e => {
    e.preventDefault()
    if (!newTaskLabel.trim()) {
      setError('La tarea no puede estar vacía')
      return
    }
    setError('')

    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://127.0.0.1:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ label: newTaskLabel }),
      })
      if (!res.ok) {
        throw new Error('Error al crear tarea')
      }
      const data = await res.json()
      setTasks([...tasks, data])
      setNewTaskLabel('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="tasklist-container">
      <h2>Mis tareas</h2>
      {error && <div className="tasklist-error">{error}</div>}
      <form onSubmit={handleAddTask} className="tasklist-form">
        <input
          type="text"
          placeholder="Nueva tarea"
          value={newTaskLabel}
          onChange={e => setNewTaskLabel(e.target.value)}
        />
        <button type="submit">Añadir</button>
      </form>

      <ul className="tasklist-items">
        {tasks.length === 0 && <li>No tienes tareas.</li>}

        {tasks.map(task => (
          <li
            key={task.id}
            className={`tasklist-item ${task.completed ? 'completed' : ''}`}
          >
            <span onClick={() => toggleComplete(task.id, task.completed)}>
              {task.label}
            </span>
            <button
              className="tasklist-delete-btn"
              onClick={() => deleteTask(task.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList
