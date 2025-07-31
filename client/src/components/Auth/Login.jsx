import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'


function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('token', data.token)
      navigate('/tasks')
    } else {
      alert(data.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
        />
        <button className="btn btn-primary" type="submit">Ingresar</button>
      </form>
      
      <div className="mt-3 text-center">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="btn btn-link p-0">
          Crear nuevo usuario
        </Link>
      </div>
    </div>
  )
}

export default Login
