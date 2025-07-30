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
        <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <div className="navbar-items"></div>
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
