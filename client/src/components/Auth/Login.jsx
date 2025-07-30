import React, { useState } from 'react'

 function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Error en login')
        return
      }

      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      window.location.href = '/tasks' // redirigir a tareas
    } catch (err) {
      setError('Error de conexión')
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Iniciar sesión</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          className="form-control my-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="form-control my-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100" type="submit">
          Entrar
        </button>
      </form>
    </div>
  )
}

export default Login