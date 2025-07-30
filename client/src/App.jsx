import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Login from './components/Auth/Login.jsx'
import Register from './components/Auth/Register.jsx'
import TaskList from './components/Tasks/TaskList.jsx'

function App() {
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/tasks" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/tasks" /> : <Register />}
        />
        <Route
          path="/tasks"
          element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App
