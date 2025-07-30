import React, { useEffect, useState } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  // Función para obtener tareas desde backend
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:5000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Error al obtener tareas");
      }
      const data = await res.json();
      if (Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Cargar tareas al montar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  // Cambiar estado completado de una tarea
  const toggleComplete = async (id, completed) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:5000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) {
        throw new Error("Error al actualizar tarea");
      }
      // Actualizamos localmente la lista para reflejar cambio
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar tarea
  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:5000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Error al eliminar tarea");
      }
      // Quitamos la tarea de la lista localmente
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h2>Mis tareas</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-group">
        {tasks.length === 0 && (
          <li className="list-group-item">No tienes tareas.</li>
        )}

        {tasks.map((task) => (
          <li
            key={task.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              task.completed ? "list-group-item-success" : ""
            }`}
          >
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => toggleComplete(task.id, task.completed)}
            >
              {task.label}
            </span>

            <button
              className="btn btn-sm btn-danger"
              onClick={() => deleteTask(task.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
