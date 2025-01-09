import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      Hello<br />
      <Routes>
        <Route path='/' element={<Home />}></Route>
      </Routes>
    </>
  )
}

export default App
