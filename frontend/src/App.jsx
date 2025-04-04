import { useState } from 'react'
import './App.css'
import OfficeFloor from './components/OfficeDesign/OfficeFloor'
import Home from './components/Home'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Register from './components/Register'
import PhaserGame from './components/PhaserDesign/PhaserGame'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/office/:spaceId" element={<PhaserGame/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
