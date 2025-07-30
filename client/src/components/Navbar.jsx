import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo a la izquierda */}
        <a href="/" className="navbar-logo">
          Todolist
        </a>

        {/* Botón hamburguesa solo en móvil */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        {/* Contenedor de menú y logout */}
        <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          {/* Aquí irían otros links o items, actualmente vacío */}
          <div className="navbar-items"></div>

          {/* Botón logout alineado a la derecha */}
          {token && (
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
