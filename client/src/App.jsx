import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Loginpage from './pages/Loginpage'
import ProfilePage from './pages/ProfilePage'
import { useAuthContext } from './context/AuthContext'

const App = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-cover bg-center bg-no-repeat">
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <Loginpage /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App