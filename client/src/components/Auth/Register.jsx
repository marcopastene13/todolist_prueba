import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('') // limpiar error anterior

    try {
      const res = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.token)
        navigate('/tasks')
      } else {
        setError(data.message || 'Error al registrar usuario')
      }
    } catch  {
      setError('Error al conectar con el servidor')
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Crear una Cuenta</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Nombre de usuario</label>
          <input
            type="text"
            name="username"
            className="form-control"
            required
            onChange={handleChange}
            value={formData.username}
          />
        </div>

        <div className="form-group mb-3">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control"
            required
            onChange={handleChange}
            value={formData.email}
          />
        </div>

        <div className="form-group mb-4">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-control"
            required
            minLength={6}
            onChange={handleChange}
            value={formData.password}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Registrarse
        </button>
      </form>

      <p className="mt-3 text-center">
        ¿Ya tienes cuenta?{' '}
        <span
          onClick={() => navigate('/login')}
          style={{ color: '#007bff', cursor: 'pointer' }}
        >
          Inicia sesión
        </span>
      </p>
    </div>
  )
}

export default Register
